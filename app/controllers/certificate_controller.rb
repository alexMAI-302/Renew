# encoding: utf-8

require "prawn"
require "prawn/measurement_extensions"

class CertificateController < ApplicationPageErrorController
  def index
    @inn=session[:certificate_inn]
  end

  #получение информации о сертификатах
  def certificate_info
    @inn=params[:info_inn]
    @ndoc=params[:info_ndoc]
    @goods_code=params[:info_goods_code]
    @certificates={}
    @in_get_info=true
    
    session[:certificate_inn]=@inn
    
    begin
      @res=ActiveRecord::Base.connection.select_all("
  		SELECT
  			certificate_id,
  			certificate_number,
  			picture_id,
  			ts,
  			ndoc,
  			goods_code,
  			goods_name
  		FROM
  			renew_web.certificates_get(#{ActiveRecord::Base.connection.quote(@inn)},
  			#{ActiveRecord::Base.connection.quote(@ndoc)},
  			#{ActiveRecord::Base.connection.quote(@goods_code)})")
    rescue => t
      logger.info t
    end

    if !@res.nil? then
      @res.each do |picture|
        actual=false
        file_name = "#{RAILS_ROOT}/public/images/certificates/#{picture['picture_id']}.jpg"
        if File.exist?(file_name) then
          if File.ctime(file_name) >= Time.parse(picture['ts']) then
          actual=true
          end
        end

        if !actual then
          bin_picture=RuzaPicture.connection.select_value("SELECT picture FROM picture WHERE id=#{picture['picture_id']}")
          file=File.new(file_name, 'wb')
          file.write(bin_picture)
          file.close
          File.chmod(0644, file_name)
        end

        if @certificates.has_key?(picture['certificate_id']) then
          if !@certificates[picture['certificate_id']]['picture_ids'].include?(picture['picture_id']) then
            @certificates[picture['certificate_id']]['picture_ids'] << picture['picture_id']
          end
        else
          @certificates[picture['certificate_id']] = {
            'picture_ids' => [picture['picture_id']],
            'certificate_number' => picture['certificate_number'],
            'ndoc' => picture['ndoc'],
            'goods_code' => picture['goods_code'],
            'goods_name' => picture['goods_name']}
        end
      end
    end

    render :partial => 'certificate'
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
          doc.image "#{RAILS_ROOT}/public/images/certificates/#{picture}.jpg", :fit => [page_size[1]-2*margin-2, page_size[0]-2*margin-2],
        end
      end
      
      headers['Content-Type'] = "application/pdf"
      send_data doc.render, :filename => "#{goods_name}.#{certificate_number}.pdf"
    else
      render :text => "Сертификат #{certificate_number} для товара #{goods_name} не найден."
    end
  end
end
