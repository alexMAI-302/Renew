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
		bad_goods_name,
		good_price,
		bad_price,
		volume
	FROM
		renew_web.get_mag_goods_data(5620)")
	render :text => res.to_json
  end
end
