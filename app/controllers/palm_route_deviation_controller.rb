# encoding: utf-8

class PalmRouteDeviationController < ApplicationSimpleErrorController

	def palm_route_deviation
	
		ddate=(nullify params[:ddate])[0..9]
		
		salesman=params[:salesman]
		supervisor=params[:supervisor]
		id=params[:id]
		
		case request.method.to_s
			when "get"
			begin
				
                palm_route_deviation = ActiveRecord::Base.connection.select_all("call ask_palm_route_deviation('#{ddate}',#{supervisor},#{salesman})")
				render :text => palm_route_deviation.to_json
			end
			when "post"
			begin
				ActiveRecord::Base.connection.execute("update palm_route_deviation set reason=#{params[:reason]}, comments='#{params[:comments]}' where id=#{:id}")
				render :text => "[]"
			end
			when "put"
			begin
				ActiveRecord::Base.connection.execute("update palm_route_deviation set reason=#{params[:reason]}, comments='#{params[:comments]}' where id=#{id}")
				render :text => "[]"
			end
			when "delete"
			begin
				ActiveRecord::Base.connection.execute("delete from palm_route_deviation where id=#{:id}")
				render :text => "[]"
			end
		end
	end
	
	def get_salesman
		ddate = params[:ddate]
		supervisor = params[:supervisor]
		salesman = ActiveRecord::Base.connection.select_all("call ask_palm_route_deviation_sm('#{ddate}',#{supervisor})")
		logger.info(ddate)
		render :json => salesman.to_json
	
	end
	
	def get_supervisor
		ddate = params[:ddate]
		supervisor = ActiveRecord::Base.connection.select_all("call ask_palm_route_deviation_sv('#{ddate}')")
		logger.info(ddate)
		render :json => supervisor.to_json
	
	end
	
	def get_reasons
		reason = ActiveRecord::Base.connection.select_all("select sv.id, sv.name from sp_values sv join sp_types st on sv.sp_tp=st.id where st.code='prd_reason'")
		render :json => reason.to_json
	end
	

	
	def index
	end
	
	private
	def nullify val
		val=(val.nil? || val=="")? "null" : val
	end

end
