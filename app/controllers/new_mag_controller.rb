# encoding: utf-8

class NewMagController < ApplicationController

  def index
  end
  
  def get_goods
	res=ActiveRecord::Base.connection.select_all("
	SELECT
		id,
		barcode,
		good_goods_name,
		bad_goods_id,
		bad_goods_name,
		good_price,
		bad_price,
		volume
	FROM
		renew_web.get_mag_goods_data(5620)")
	render :text => res.to_json
  end
  
  def palm_sales
	case request.method.to_s
		when 'get' then
		    res=ActiveRecord::Base.connection.select_all("
			CALL renew_web.get_mag_sales(
				1099,
				'#{Time.parse(params[:ddateb]).strftime('%F %T')}',
				'#{Time.parse(params[:ddatee]).strftime('%F %T')}'
			)")
			render :text => res.to_json
		when 'post' then
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
		when 'post' then
	end
  end
end
