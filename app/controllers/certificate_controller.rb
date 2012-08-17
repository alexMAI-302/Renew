# encoding: utf-8

require 'base64'

class CertificateController < ApplicationController

  def index
  end
  
  #получение информации о сертификатах
  def certificate_info
	@inn=params[:info_inn]
	@ndoc=params[:info_ndoc]
	@goods_name=params[:info_goods_name]
	
	begin
		@res=ActiveRecord::Base.connection.select_all("SELECT
			picture.id,
			picture.ts,
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
		@res.each |picture| do
			if !File.exist("/var/www/renew_test/public/images/certificates/#{picture['id']}.jpg")? then
			end
		end
	end
	
	render :partial => 'certificate'
  end
  
  def get_certificate
	id=params[:id]
	inn=params[:inn]
	ndoc=params[:ndoc]
	res=nil
	begin
		res=ActiveRecord::Base.connection.select_one("
		SELECT
			picture.picture
		FROM
			sale_order so
			JOIN sordgoods sog ON sog.id=so.id
			JOIN cert_goods cg ON sog.goods = cg.goods
			join certificate c on c.id = cg.certificate
			JOIN cert_image ci ON ci.certificate=c.id
			JOIN picture ON picture.id=ci.picture
			JOIN buyers b ON b.id=sog.client
			JOIN payers p ON b.payer=p.id OR p.partner=b.partner
		WHERE
			(p.inn=#{ActiveRecord::Base.connection.quote(inn)} OR p.inn IS NULL)
			AND
			so.ndoc=#{ActiveRecord::Base.connection.quote(ndoc)}
			AND
			c.id=#{ActiveRecord::Base.connection.quote(id)}
			AND
			cg.status=1
			AND
			ci.status1=1
			AND
			so.ddate BETWEEN c.ddateb AND c.ddatee")
	rescue => t
		logger.info t
	end
	
	response.headers['Content-Type'] = 'image/jpeg'
	response.headers['Content-Disposition'] = 'inline'

	render :text => (!res.nil?) ? res['picture'] : ''
  end
end
