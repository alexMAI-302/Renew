# encoding: utf-8
class DealerReportController < ApplicationSimpleErrorController
  
  def index
  end
    
  def get
	  case request.method.to_s
		when "get"
			res=ActiveRecord::Base.connection.select_all("call dbo.ask_dealer_report_checked()")
			 render :text => res.to_json
		end
  end
  
  def save
	  case request.method.to_s
		when "post"
			rows=ActiveSupport::JSON.decode(request.body.gets)
			items=rows.to_xml(:root => "rows")
			s = "call dbo.prc_dealer_report_save(#{ActiveRecord::Base.connection.quote(items)})"
			r = ActiveRecord::Base.connection.execute(s)
			logger.info(s)
			render :text => {"success" => true}.to_json
		end
  end
  
  def save_email
	  case request.method.to_s
		when "post"
			rows=ActiveSupport::JSON.decode(request.body.gets)
			items=rows.to_xml(:root => "rows")
			s = "call dbo.prc_dealer_report_email_save(#{ActiveRecord::Base.connection.quote(items)})"
			r = ActiveRecord::Base.connection.execute(s)
			logger.info(s)
			render :text => {"success" => true}.to_json
		end
  end
  
  def get_report
    case request.method.to_s
      when "get"
		res=ActiveRecord::Base.connection.select_all("call dbo.ask_dealer_report_reports()")
			 render :text => res.to_json
     end
  end
  def button
	  case request.method.to_s
		when "post"
			button_name=ActiveRecord::Base.connection.quote (params[:button_name])
			button =params[:button].to_i
      		ActiveRecord::Base.connection.update ("insert into button_click (button,button_name) values (#{button},#{button_name});")
			render :text => {"success" => true}.to_json
		end
  end
  
  
end