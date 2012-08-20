# encoding: utf-8

class CertificateController < ApplicationController

  def index
  end
  
  #получение информации о сертификатах
  def certificate_info
	@inn=params[:info_inn]
	@ndoc=params[:info_ndoc]
	@goods_name=params[:info_goods_name]
	
	begin
		@res=ActiveRecord::Base.connection.select_all("
		SELECT
			picture.id,
			IF picture.ts >= ci.ts AND picture.ts>=c.ts AND picture.ts>=cg.ts THEN picture.ts ELSE
				IF ci.ts >= picture.ts AND ci.ts>=c.ts AND ci.ts>=cg.ts THEN ci.ts ELSE
					IF c.ts >= picture.ts AND c.ts>=ci.ts AND c.ts>=cg.ts THEN c.ts ELSE
						IF cg.ts >= picture.ts AND cg.ts>=ci.ts AND cg.ts>=c.ts THEN cg.ts
						END IF
					END IF
				END IF
			END IF ts,
			g.short_name goods_name
		FROM
			sale_order so
			JOIN sordgoods sog ON sog.id=so.id
			JOIN cert_goods cg ON sog.goods = cg.goods
			join certificate c on c.id = cg.certificate
			JOIN cert_image ci ON ci.certificate=c.id
			JOIN picture ON picture.id=ci.picture
			JOIN goods g ON g.id=sog.goods
			JOIN buyers b ON b.id=sog.client
			JOIN payers p ON b.payer=p.id OR p.partner=b.partner
		WHERE
			p.inn=#{ActiveRecord::Base.connection.quote(@inn)}
			AND
			so.ndoc=#{ActiveRecord::Base.connection.quote(@ndoc)}
			AND
			g.short_name like '%'+#{ActiveRecord::Base.connection.quote(@goods_name)}+'%'
			AND
			cg.status=1
			AND
			so.ddate BETWEEN c.ddateb AND c.ddatee")
	rescue => t
		logger.info t
	end
	
	if !@res.nil? then
		@res.each do |picture|
			actual=false
			file_name = "/var/www/renew_test/public/images/certificates/#{picture['id']}.jpg"
			if File.exist?(file_name) then
				if File.ctime(file_name) >= Time.parse(picture['ts']) then
					actual=true
				end
			end
			
			if !actual then
				bin_picture=ActiveRecord::Base.connection.select_value("SELECT picture FROM picture WHERE id=#{picture['id']}")
				file=File.new(file_name, 'wb')
				file.write(bin_picture)
				file.close
			end
		end
	end
	
	render :partial => 'certificate'
  end
end
