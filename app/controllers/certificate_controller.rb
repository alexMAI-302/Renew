# encoding: utf-8

require "prawn"
require "prawn/measurement_extensions"

class CertificateController < ApplicationPageErrorController
  def index
    if !session[:certificate].nil?
      @inn=session[:certificate][:inn]
      @ndoc=session[:certificate][:ndoc]
      @goods_code=session[:certificate][:goods_code]
    end
  end

  #получение информации о сертификатах
  def get_certificates
    inn=params[:inn]
    ndoc=params[:ndoc]
    goods_code=params[:goods_code]
    
    session[:certificate]={
      :inn=>inn,
      :ndoc=>ndoc,
      :goods_code=>goods_code
    }
    
    certificates={}
    goods={}
    to_render=[]
    
    info=ActiveRecord::Base.connection.select_all("
		SELECT
			certificate_id,
			certificate_number,
			picture_id,
			ndoc,
			goods_code,
			goods_name
		FROM
			renew_web.certificates_get(#{ActiveRecord::Base.connection.quote(inn)},
			#{ActiveRecord::Base.connection.quote(ndoc)},
			#{ActiveRecord::Base.connection.quote(goods_code)})")
	  if !info.nil? then
	    #начать обновление кэша на диске
	    picture_ids=info.collect do |i|
        i["picture_id"]
      end
      
      pictures_ts=RuzaPicture.connection.select_all("SELECT DISTINCT id, ts FROM picture WHERE id IN (#{picture_ids*','})")
      
      if !pictures_ts.nil? then
        pictures_ts.each do |picture|
          actual=false
          file_name = "#{RAILS_ROOT}/public/images/certificates/#{picture['id']}.jpg"
          if File.exist?(file_name) then
            if File.ctime(file_name) >= Time.parse(picture['ts']) then
              actual=true
            end
          end
          
          if !actual then
            bin_picture=RuzaPicture.connection.select_value("SELECT picture FROM picture WHERE id=#{picture['id']}")
            file=File.new(file_name, 'wb')
            file.write(bin_picture)
            file.close
            File.chmod(0644, file_name)
          end
        end
      end
      #Закончить обновление кэша на диске
      
      info.each do |i|
        
        if goods.has_key?(i['certificate_id']) then
          if !goods[i['certificate_id']]['goods_codes'].include?(i['goods_code']) then
            goods[i['certificate_id']]['goods_codes'] << i['goods_code']
            goods[i['certificate_id']]['goods_names'] << i['goods_name']
          end
        else
          goods[i['certificate_id']]={}
          goods[i['certificate_id']]['goods_codes'] = [i['goods_code']]
          goods[i['certificate_id']]['goods_names'] = [i['goods_name']]
        end
        
        if certificates.has_key?(i['certificate_id']) then
          if !certificates[i['certificate_id']]['picture_ids'].include?(i['picture_id']) then
            certificates[i['certificate_id']]['picture_ids'] << i['picture_id']
          end
        else
          certificates[i['certificate_id']] = {
            'picture_ids' => [i['picture_id']],
            'certificate_number' => i['certificate_number'],
            'ndoc' => i['ndoc']}
        end
      end
	  end
	  
    certificates.each do |id, cert|
      goods[id]['goods_codes'].each_index do |goods_num|
        to_render << {
          'id' => "#{id}_#{goods[id]['goods_codes'][goods_num]}",
          'ndoc' => cert['ndoc'],
          'goods_code' => goods[id]['goods_codes'][goods_num],
          'goods_name' => goods[id]['goods_names'][goods_num],
          'certificate_number' => cert['certificate_number'],
          'jpg_url' => "/certificate/certificate_pages?pictures=#{cert['picture_ids'].join(',')}&certificate_number=#{cert['certificate_number']}&goods_name=#{goods[id]['goods_names'][goods_num]}",
          'pdf_url' => "/certificate/certificate_pdf?pictures=#{cert['picture_ids'].join(',')}&certificate_number=#{cert['certificate_number']}&goods_name=#{goods[id]['goods_names'][goods_num]}"
        }
      end
    end

    render :text => to_render.to_json
  end

  def certificate_pages
    @pictures=params[:pictures].split(',')

    @goods_name=params[:goods_name]
    @certificate_number=params[:certificate_number]

    render :layout => 'application_empty'
  end
  
  def certificate_pdf
    margin=5.send(:mm)
    page_size=Prawn::Document::PageGeometry::SIZES["A4"]
    pictures=params[:pictures].split(',')

    goods_name=params[:goods_name]
    certificate_number=params[:certificate_number]
    
    if !pictures.nil?
      doc = Prawn::Document.new(
        :page_size => page_size,
        :margin => margin,
        :page_layout => :landscape
      ) do |doc|
        pictures.each_with_index do |picture, i|
          if i>0
            doc.start_new_page
          end
          doc.image "#{RAILS_ROOT}/public/images/certificates/#{picture}.jpg", :fit => [page_size[1]-2*margin-2, page_size[0]-2*margin-2]
        end
      end
      
      headers['Content-Type'] = "application/pdf"
      send_data doc.render, :filename => "#{goods_name}.#{certificate_number}.pdf"
    else
      render :text => "Сертификат #{certificate_number} для товара #{goods_name} не найден."
    end
  end
end
