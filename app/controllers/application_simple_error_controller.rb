# encoding: utf-8
# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationSimpleErrorController < ApplicationController
  
  rescue_from ActiveRecord::ActiveRecordError, :with => :show_errors
  rescue_from ActionController::RoutingError, :with => :render_not_found
  rescue_from ActionController::UnknownController, :with => :render_not_found
  rescue_from ActionController::UnknownAction, :with => :render_not_found
  
  protected
   def show_errors(exception)
	render :text => exception.message, :status => 500
  end
  
  protected
  def render_not_found(exception)
	render :text => "Запрашиваемый Вами ресурс #{request.request_uri} не найден", :status => 404
  end
  
  
end
