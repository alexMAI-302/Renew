# encoding: utf-8

class ReschedulingController < ApplicationSimpleErrorController

	
	def get_person
		rs = ActiveRecord::Base.connection.select_all("select * from ask_rescheduling_person()")
		render :json => rs.to_json
	end
	
	def get_shiftworker
		ddate1=(params[:ddate1].nil? || params[:ddate1].to_s=='')?('1900-01-01'):Time.parse(params[:ddate1]).strftime('%F')
		ddate2=(params[:ddate2].nil? || params[:ddate2].to_s=='')?('1900-01-01'):Time.parse(params[:ddate2]).strftime('%F')
		rs = ActiveRecord::Base.connection.select_all("select * from ask_rescheduling_shiftworker('#{ddate1}','#{ddate2}')")
		render :json => rs.to_json
	end
	
	def exchange_shift
		rows=ActiveSupport::JSON.decode(request.body.gets)
		items=rows.to_xml(:root => "rows")
		s = "call dbo.prc_rescheduling_exchange(#{ActiveRecord::Base.connection.quote(items)})"
		r = ActiveRecord::Base.connection.execute(s)
		logger.info(s)
		render :text => 'ok'
	end
	
	def leave
		rows=ActiveSupport::JSON.decode(request.body.gets)
		items=rows.to_xml(:root => "rows")
		s = "call dbo.prc_rescheduling_leave(#{ActiveRecord::Base.connection.quote(items)})"
		r = ActiveRecord::Base.connection.execute(s)
		logger.info(s)
		render :text => 'ok'
	end
	def daychange
		rows=ActiveSupport::JSON.decode(request.body.gets)
		items=rows.to_xml(:root => "rows")
		s = "call dbo.prc_rescheduling_daychange(#{ActiveRecord::Base.connection.quote(items)})"
		r = ActiveRecord::Base.connection.execute(s)
		logger.info(s)
		render :text => 'ok'
	end
	
	
	def index
	end
	
	private
	def nullify val
		val=(val.nil? || val=="")? "null" : val
	end

end
