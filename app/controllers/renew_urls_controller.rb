# encoding: utf-8

class RenewUrlsController < ApplicationPageErrorController
  def index
  end
  
  def get_renew_url_types
    render :text => RenewUrlType.all(:order => "name").to_json
  end
  
  def renew_urls
    method=request.method.to_s
    case method
    when "get"
      renew_urls = RenewUrl.all(
        :order => "name",
        :conditions => ["(url_type_id = :type or :type = 0)",
          {:type => params[:url_type_id].to_i}]
      )
      
      render :text => renew_urls.to_json
    when "post"
      renew_url = RenewUrl.create(
      'name'=>params[:name],
      'url_pattern'=>params[:url_pattern],
      'url_type_id'=>params[:url_type_id],
      'sorder'=>params[:sorder])
      
      render :text => {"success" => true}.to_json
    when "put"
      RenewUrl.update(
      params[:id],
      {'name'=>params[:name],
      'url_pattern'=>params[:url_pattern],
      'url_type_id'=>params[:url_type_id],
      'sorder'=>params[:sorder]})
      
      render :text => {"success" => true}.to_json
    when "delete"
      RenewUrl.find(params[:id]).destroy
      
      render :text => {"success" => true}.to_json
    end
  end
end
