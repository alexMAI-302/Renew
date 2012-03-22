class DeliveryController < ApplicationController  
  def index
	set_conditions	
	@rst_site = ActiveRecord::Base.connection.select_all( " select id, name from site where istarget = 1 " )
	@site_list = @rst_site.collect {|p| [ p["name"], p["id"] ] }
	
	@rst_schedule = ActiveRecord::Base.connection.select_all( " select id, name from schedule " )
	@schedule_list = @rst_schedule.collect {|p| [ p["name"], p["id"] ] }
	
	@rst_route = ActiveRecord::Base.connection.select_all( " call dbo.ask_route_sale( '" + @ddate.strftime("%Y-%m-%d") + "', #{@site}, #{@schedule_id} ) ") 
	
  end
  
  def save_delivery
	if params[:a]
		params[:r].delete_if do | key, value |
			value[:needsave] == "0" or ( value[:sord] == "" and value[:inc] == "" ) 
		end
		ar = []
		params[:r].each_pair do | key, value |
			value[:routeid] = key
			ar << value
		end
		params[:r] = ar
		s = "begin declare @r int;  @r = call prc_delivery('#{params.to_xml}'); commit; select @r r; end;"
		logger.info s
		r = ActiveRecord::Base.connection.select_value(s)
		logger.info "------------------- #{r}  -----------------------"
	end
	redirect_to :action => "index"
  end
 
private

  def set_conditions
	@site = 1
	@schedule_id = 1384
	@ddate = Time.now + 1.day;
	if params[:post] 
		@site = params[:post][:site].to_i
		session[:site]  = @site 
		@schedule_id = params[:post][:schedule].to_i
		session[:schedule]  = @schedule_id 
		@ddate = Date.strptime(params[:post][:ddate], '%d.%m.%Y')   
		session[:ddate]  = @ddate
	else
		@site = session[:site] if session[:site]
		@schedule_id = session[:schedule] if session[:schedule]
		@ddate = session[:ddate] if session[:ddate]
	end
  end
end
  