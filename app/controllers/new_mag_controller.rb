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
			SELECT
				id,
				ddate,
				sumtotal,
				is_sync,
				closed
			FROM
				renew_web.get_mag_sales(
				'#{session[:user_id]}',
				'#{Time.parse(params[:ddateb]).strftime('%F %T')}',
				'#{Time.parse(params[:ddatee]).strftime('%F %T')}'
			)")
			render :text => res.to_json
	end
  end
  
  def palm_sale
  
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
		when 'delete' then
			id=params[:id].to_i
			ActiveRecord::Base.connection.execute("
			DELETE FROM palm_saleitemmagaz WHERE sale_id = #{id};
			DELETE FROM palm_sale WHERE sale_id = #{id};")
			render :text => ""
	end
	
  end
  
  def palm_sale_items
	case request.method.to_s
		when 'get' then
		    res=ActiveRecord::Base.connection.select_all("
			SELECT
				goods_id,
				barcode,
				name,
				is_good,
				volume,
				price,
				cost
			FROM
				renew_web.get_mag_sale_items('#{session[:user_id]}', #{params[:sale_id].to_i})
			")
			render :text => res.to_json
	end
  end
end
