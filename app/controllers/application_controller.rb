# encoding: utf-8
# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
    
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  filter_parameter_logging :password
  
  rescue_from ActiveRecord::ActiveRecordError, :with => :show_errors
  rescue_from ActionController::RoutingError, :with => :render_not_found
  rescue_from ActionController::UnknownController, :with => :render_not_found
  rescue_from ActionController::UnknownAction, :with => :render_not_found

  before_filter :store_location, :except => [:login, :logout]
  before_filter :check_access
  
  private
  def store_location
	# меню загружается ajax-запросом, поэтому не надо сохранять ссылку на него
	if request.path[Regexp.new("^/util_data/get_menu.*")] != request.path
		session[:return_to] = request.request_uri
	end
  end
  
  protected
  def check_access
	$username=(!session[:user_id].nil?)?(session[:user_id]):("guest")
	user_urls=ActiveRecord::Base.connection.select_all("
	SELECT DISTINCT
		url_pattern
	FROM
		renew_web.renew_url ru
		JOIN renew_web.renew_users_urls ruu ON ru.id=ruu.renew_user_url_id
		JOIN renew_web.renew_users_groups rug ON rug.renew_user_group_id=ruu.renew_user_group_id
		JOIN renew_web.renew_users rusr ON rusr.id=rug.renew_user_id
	WHERE
		rusr.name='#{session[:user_id]}'
		OR
		rusr.name='guest'
	")
	check_status=false
	if !user_urls.nil? then
		user_urls.each do |user_url|
			if request.path[Regexp.new(user_url["url_pattern"])] == request.path then
				check_status=true
				break
			end
		end
	end
	
	unless check_status
		if session[:user_id].nil? then
			redirect_to :controller => "login", :action => "login"
		else
			@error_text="#{request.request_uri}"
			render :template => "/errors/403.html.erb", :status => 403
		end
	end
  end
  
  protected
   def show_errors(exception)
	@error_text=exception.message
	if @error_text.index("-57010") then
		@error_text.insert(6," Не найдены агенты для маршрутов ")
	end
	
	render :template => "/errors/500.html.erb", :status => 500
  end
  
  protected
  def render_not_found(exception)
	@error_text="Запрашиваемый Вами ресурс #{request.request_uri} не найден"
	
	render :template => "/errors/500.html.erb", :status => 404
  end
  
  
end
