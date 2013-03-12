# encoding: utf-8

class IncomeReturnController < ApplicationSimpleErrorController

	def income_return
	
		inc_id=params[:inc_id]
		
		case request.method.to_s
			when "get"
			begin
				income_return = ActiveRecord::Base.connection.select_all("call ask_income_return(#{inc_id})")
				#logger.info(income_return.to_json)
				render :text => income_return.to_json
			end
		end
	end
		
	def get_income
		ddate=(params[:ddate].nil? || params[:ddate].to_s=='')?('1900-01-01'):params[:ddate]
		query=(params[:query].nil?)?(''):params[:query]
		income = ActiveRecord::Base.connection.select_all("select * from ask_income_return_income('#{ddate}','#{ActiveRecord::Base.connection.quote_string(query)}')")
		#logger.info(ddate)
		render :json => income.to_json
	end
	
	def get_inn
		inn_part = params[:query]
		s = "select * from ask_income_return_inn('#{ActiveRecord::Base.connection.quote_string(params[:query])}')"
		inn = ActiveRecord::Base.connection.select_all(s)
		logger.info(inn_part)
		render :json => inn.to_json
	
	end
	
	def get_pr
		inn=(params[:inn].nil?)?(''):params[:inn]
		pr = ActiveRecord::Base.connection.select_all("select id, name from ask_income_return_pr('#{ActiveRecord::Base.connection.quote_string(inn)}')")
		render :json => pr.to_json
	
	end
	
	def get_seller
		pr =(params[:pr].nil?)?('-1'):params[:pr]
		seller = ActiveRecord::Base.connection.select_all("select id, name from ask_income_return_seller(#{ActiveRecord::Base.connection.quote_string(pr)})")
		render :json => seller.to_json
	
	end
	
	def get_org
		inn=(params[:inn].nil?)?(''):params[:inn]
		org = ActiveRecord::Base.connection.select_all("select id, name from ask_income_return_org('#{ActiveRecord::Base.connection.quote_string(inn)}')")
		render :json => org.to_json
	
	end
	
	def get_measure
		rs = ActiveRecord::Base.connection.select_all("select id, name from measures")
		render :json => rs.to_json
	
	end
	
	def get_goods
		query=(params[:query].nil?)?(''):params[:query]
		rs = ActiveRecord::Base.connection.select_all("select * from ask_income_return_goods('#{query}')")
		render :json => rs.to_json
	
	end
	
	def get_mrs
		rs = ActiveRecord::Base.connection.select_all("select number() id, ms_id, msrh_id, rel from ms_rel_sets")
		render :json => rs.to_json	
	end
	
	def save_doc
		rows=ActiveSupport::JSON.decode(request.body.gets)
		items=rows.to_xml(:root => "rows")
		s = "call dbo.prc_income_return_save(#{ActiveRecord::Base.connection.quote(items)})"
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
