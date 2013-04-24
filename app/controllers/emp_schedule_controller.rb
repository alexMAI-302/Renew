# encoding: utf-8

class EmpScheduleController < ApplicationSimpleErrorController

	def emp_schedule
	
		dept_id=(params[:dept_id].nil?)?(-1):(params[:dept_id]=='')?(0):params[:dept_id]
		person_id=(params[:person_id].nil?)?(-1):( (params[:person_id]=='')?(-1):params[:person_id] )
		ddateb=(params[:ddateb].nil? || params[:ddateb].to_s=='')?('1900-01-01'):params[:ddateb]
		ddatee=(params[:ddatee].nil? || params[:ddatee].to_s=='')?('9999-01-01'):params[:ddatee]
		case request.method.to_s
			when "get"
			begin
				rs = ActiveRecord::Base.connection.select_all("call ask_emp_schedule(#{dept_id},#{person_id},'#{ddateb}','#{ddatee}')")
				logger.info(rs.to_json)
				render :text => rs.to_json
			end
		end
	end
		
	def get_dept
		rs = ActiveRecord::Base.connection.select_all("select * from ask_emp_schedule_dept('#{ActiveRecord::Base.connection.quote_string(params[:query])}')")
		render :json => rs.to_json
	end
	
	def get_person
		dept_id=(params[:dept_id].nil?)?(-1):params[:dept_id]
		rs = ActiveRecord::Base.connection.select_all("select * from ask_emp_schedule_person(#{dept_id})")
		render :json => rs.to_json
	end
	
	
	def save_doc
		rows=ActiveSupport::JSON.decode(request.body.gets)
		items=rows.to_xml(:root => "rows")
		s = "call dbo.prc_emp_schedule_save(#{ActiveRecord::Base.connection.quote(items)})"
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
