# encoding: utf-8

class CertificateController < ApplicationPageErrorController

  def index
  end
  
  #получение информации о сертификатах
  def certificate_info
	@inn=params[:info_inn]
	@ndoc=params[:info_ndoc]
	@goods_code=params[:info_goods_code]
	@certificates={}
	
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
				bin_picture=ActiveRecord::Base.connection.select_value("SELECT picture FROM picture WHERE id=#{picture['picture_id']}")
				file=File.new(file_name, 'wb')
				file.write(bin_picture)
				file.close
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
	logger.info @pictures
	@goods_name=params[:goods_name]
	@certificate_number=params[:certificate_number]
	
	render :layout => 'application_empty'
  end
end