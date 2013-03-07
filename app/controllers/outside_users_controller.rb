# encoding: utf-8

class OutsideUsersController < ApplicationSimpleErrorController
  def index
  end
  
  def outside_users
    method=request.method.to_s
    case method
    when "get"
      render :text => RenewOutsideUser.find(:first, params[:id]).to_json
    when "put"
      RenewOutsideUser.update(params[:id], :renew_user_id => params[:renew_user_id])
      
      render :text => {"success" => true, "id" => params[:id]}.to_json
    when "delete"
      RenewOutsideUser.delete(params[:id])
      
      render :text => {"success" => true}.to_json
    end
  end
  
  def get_renew_users
    render :text => RenewUser.find(:all).to_json
  end
end