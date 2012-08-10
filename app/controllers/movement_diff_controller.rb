# encoding: utf-8

class MovementDiffController < ApplicationController

	def movement_diff
		case request.method.to_s
			when "get"
				ddateb=params[:ddateb]
				ddatee=params[:ddatee]
				
				site_from=params[:site_from]
				site_to=params[:site_to]
				
                movement_diff_list = Proxycat.connection.select_all("exec dbo.ask_movement_diff
				'#{ddateb}',
				'#{ddatee}',
				#{site_from},
				#{site_to}")
				
				render :text => movement_diff_list.to_json
			when "post"
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
			when "put"
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
			when "delete"
				Proxycat.connection.execute("exec prc_del_sell_price #{site_id}, #{params[:id]}")
				render :text => "[]"
		end
	end
	
	def clear_diff
		render :text => 'ok'
	end

	def index
	end

end
