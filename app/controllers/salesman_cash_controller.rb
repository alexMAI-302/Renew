# encoding: utf-8
class SalesmanCashController < ApplicationSimpleErrorController
	def index
	end
	
	def get_salesmans
	  res=ActiveRecord::Base.connection.select_all("
    SELECT
      salesman_id id,
      name
    FROM
      palm_salesman
    ORDER BY
      name")
    render :text => res.to_json
	end
	
	def salesman_cashes
	  method=request.method.to_s
    case method
    when "get"
      res=ActiveRecord::Base.connection.select_all("
      call renew_web.salesman_cashes_get(#{params[:salesman_id].to_i})")
      render :text => res.to_json
    when "put"
      cashes=ActiveSupport::JSON.decode(request.body.gets)
      if Array.try_convert(cashes).nil?
        cashes=[cashes]
      end
      items=cashes.to_xml(:root => "cashes")
      res = ActiveRecord::Base.connection.select_value("
      SELECT renew_web.salesman_cashes_save(
      #{params[:salesman_id].to_i}),
      #{ActiveRecord::Base.connection.quote(items)})")
      if res=='OK'
        render :text => {"success" => true}.to_json
      else
        render :text => {"success" => false, "msg" => res}.to_json
      end
    end
	end
	
	def print_cash
	  recepts = []
	  @cash = 0.0
	  @white_cash = 0.0
	  params["ndoc"].each do |ndoc|
	    recepts << { :id => ndoc[1][:id], :cash => (ndoc[1][:cash].to_i>0)?ndoc[1][:cash]:nil}
	  end
	  items = recepts.to_xml
	  @cash_data=ActiveRecord::Base.connection.execute("
    call renew_web.salesman_cashes_get_print_data(
    #{params[:salesman_id].to_i},
    #{ActiveRecord::Base.connection.quote(items)})")
    
    if @cash_data.nil? || @cash_data.length==0
      render :text => "Нет данных"
    else
      @cash_data.each do |r|
        @cash=@cash+r["cash"].to_f
        if r["org_name"]=="Барос"
          @white_cash=@white_cash+r["cash"].to_f
        end
      end
      @person = @cash_data[0]["person"]
      @ddate = (Time.now).strftime('%F')
      render :layout => 'application_empty'
    end
    
	end
end