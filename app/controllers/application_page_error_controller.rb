# encoding: utf-8
# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationPageErrorController < ApplicationController
  
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
