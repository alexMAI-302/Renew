class ScheduleRequestListController < ApplicationController

before_filter :authorize 

def index

	set_conditions
	@rst = ActiveRecord::Base.connection.select_all('exec ask_schedule_request_list'+@str_cond)
end
 
def set_conditions
	@ddateb =Date.today().to_s
	@ddatee =Date.today().to_s
	if params[:ddateb]
		@ddateb = params[:ddateb]
		session[:ddateb] = @ddateb
	else
		session[:ddateb] = nil
	end

	if params[:ddatee]
		@ddatee = params[:ddatee]
		session[:ddatee] = @ddatee
	else
		session[:ddatee] = nil
	end
	@str_cond = " '#{@ddateb}', '#{@ddatee} ' "
	
 end

def authorize
	unless session[:user_id] 
	flash[:notice] = " Autorization in Schedule_Request_List "
	redirect_to :controller => "login", :action => "login" 
end

end 
end