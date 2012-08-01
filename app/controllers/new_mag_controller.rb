# encoding: utf-8

class NewMagController < ApplicationController

  def index
  end
  
  def get_goods
	res=ActiveRecord::Base.connection.select_all("
	SELECT
		id,
		goods_id,
		is_good,
		barcode,
		name,
		price,
		volume
	FROM
		renew_web.get_mag_goods_data('#{session[:user_id]}')")
	render :text => res.to_json
  end
  
  def palm_sales_get
	case request.method.to_s
		when 'get' then
		    res=ActiveRecord::Base.connection.select_all("
			CALL renew_web.get_mag_sales(
				'#{session[:user_id]}',
				'#{Time.parse(params[:ddateb]).strftime('%F %T')}',
				'#{Time.parse(params[:ddatee]).strftime('%F %T')}'
			)")
			render :text => res.to_json
	end
  end
  
  def palm_sale_save
	case request.method.to_s
		when 'post' then
			sale=ActiveSupport::JSON.decode(request.body.gets)["palm_sale"]
			items=sale["sale_items"].to_xml(:root => "sale_items")
		    res=ActiveRecord::Base.connection.select_all("
			CALL renew_web.save_mag_sale(
				'#{session[:user_id]}',
				'#{Time.parse(sale["ddate"].gsub(/[T]/, ' ')).strftime('%F %T')}',
				#{sale["sumtotal"].to_f},
				'#{items}'
			)")
			render :text => ""
	end
  end
  
  def palm_sale_items
	case request.method.to_s
		when 'get' then
		    res=ActiveRecord::Base.connection.select_all("
			SELECT DISTINCT
				ISNULL(cg.id, g.id) goods_id,
				list(gb.barcode) barcode,
				IF cg.id IS NULL THEN g.short_name ELSE cg.name END IF name,
				psi.volume,
				psi.price,
				psi.cost
			FROM
				palm_saleitemmagaz psi
				LEFT JOIN cutgoods cg ON cg.id=psi.goods_id
				JOIN goods g ON g.id=psi.goods_id OR g.cutgoods=psi.goods_id
				JOIN goods_barcode gb ON gb.goods=g.id
			WHERE
				sale_id=#{params[:sale_id].to_i}
			GROUP BY
				goods_id,
				name,
				psi.volume,
				psi.price,
				psi.cost
			")
			render :text => res.to_json
	end
  end
end
