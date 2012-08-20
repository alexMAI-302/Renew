# encoding: utf-8

class SellPriceController < ApplicationSimpleErrorController

	def sell_prices
		ddateb=(nullify params[:ddateb])[0..9]
		ddatee=(params[:ddatee] && params[:ddatee]!="" && params[:ddatee]!="null")?(params[:ddatee][0..9]):('01-01-9999')
		
		strs=params[:partner_id].split("_")
		partner_id=strs[0]
		site_id=strs[1]
		
		case request.method.to_s
			when "get"
			begin
				
                sell_prices_list = Proxycat.connection.select_all("exec ask_sell_price #{site_id}, #{partner_id}, '#{ddateb}', '#{ddatee}'")
					
				render :text => sell_prices_list.to_json
			end
			when "post"
			begin
				Proxycat.connection.execute(
				"exec dbo.prc_ins_sell_price
				#{partner_id},
				#{params[:goods_id]},
				'#{ddateb}',
				'#{ddatee}',
				#{params[:discount]/100.0},
				#{nullify params[:sell_reason_id]},
				#{site_id}")
				
				render :text => "[]"
			end
			when "put"
			begin
				Proxycat.connection.execute(
				"exec dbo.prc_ins_sell_price
				#{partner_id},
				#{params[:goods_id]},
				'#{ddateb}',
				'#{ddatee}',
				#{params[:discount]/100.0},
				#{nullify params[:sell_reason_id]},
				#{site_id}")
				
				render :text => "[]"
			end
			when "delete"
			begin
				Proxycat.connection.execute("exec prc_del_sell_price #{site_id}, #{params[:id]}")
				render :text => "[]"
			end
		end
	end
	
	def get_goods_prices
		strs=params[:partner_id].split("_")
		partner_id=strs[0]
		site_id=strs[1]
		
		goods_prices=Proxycat.connection.select_all("exec ask_yellow_goods #{site_id}, #{partner_id}")
                                            
		render :json => goods_prices.to_json
	end
	
	def get_lggroups
		strs=params[:partner_id].split("_")
		partner_id=strs[0]
		site_id=strs[1]
		
		lggroups=Proxycat.connection.select_all("exec ask_yellow_lggroup #{site_id}, #{partner_id}")
		render :json => lggroups.to_json
	end
	
	def get_discount_reasons
		discount_reasons=ActiveRecord::Base.connection.select_all("
		SELECT
			id,
			name
		FROM
			sell_reason")
		render :json => discount_reasons.to_json
	end
	
	def get_partners
		partners=Proxycat.connection.select_all("
		exec dbo.ask_sell_price_user_partners '#{session[:user_id]}', '#{params[:query]}', #{params[:limit]}")
		render :json => partners.to_json
	end

	def index
	end
	
	private
	def nullify val
		val=(val.nil? || val=="")? "null" : val
	end

end
