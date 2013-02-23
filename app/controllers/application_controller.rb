# encoding: utf-8

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
    
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  filter_parameter_logging :password

  before_filter :store_location, :except => [:login, :logout]
  before_filter :check_access
  
  before_filter :create_page_content
  
  private
  def create_page_content
    @my_url=RenewUrl.first(
      :select => 'renew_web.renew_url.id, rpc.height, rpc.width, rpc.html',
      :joins => 'JOIN renew_web.renew_page_content rpc ON rpc.renew_url_id=renew_web.renew_url.id',
      :conditions => ["url_type_id = (SELECT rut.id FROM renew_web.renew_url_type rut WHERE rut.name='Пункт меню')
      AND
      url_pattern=?", request.path])
  end
  
  def store_location
  	# меню загружается ajax-запросом, поэтому не надо сохранять ссылку на него
  	if request.path[Regexp.new("^/util_data/get_menu.*")] != request.path
  		session[:return_to] = request.request_uri
  	end
  end
  
  protected
  def check_access
    $username=(!session[:user_id].nil?)?(session[:user_id]):("guest")
  	user_urls=RenewUrl.user_urls(session[:user_id])
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
  		  if request.path!="/auth" && request.path!="/login/login"
  		    redirect_to "/login/login"
  		  end
  		else
  			@error_text="#{request.request_uri}"
  			render :template => "/errors/403.html.erb", :status => 403
  		end
  	end
  end
end
