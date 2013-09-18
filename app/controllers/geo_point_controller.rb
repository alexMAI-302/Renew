# encoding: utf-8

class GeoPointController < ApplicationSimpleErrorController
  
  def geo_points
    method=request.method.to_s
    case method
    when "get"
      branch     = params[:branch].present?      ? params[:branch].to_i : 'null'
      point_kind = params[:point_kind].present?  ? params[:point_kind].to_i : 'null'
      filter_str = params[:filter_str].present?  ? '"' + ActiveRecord::Base.connection.quote_string(params[:filter_str].to_s) + '"' : 'null'
      terminal   = params[:terminal_id].present? ? params[:terminal_id].to_i : 'null'
      agent      = params[:agent].present?       ? params[:agent].to_i : 'null'
      
      data = ActiveRecord::Base.connection.select_all("call dbo.geo_point(#{branch}, #{point_kind}, #{filter_str}, #{terminal}, #{agent})")
      
      render :text => data.to_json
    when "put"
      Geoaddress.update(
        params[:id],
        {
          :taddress_old => params[:taddress],
          :fulladdress => params[:fulladdress],
          :srcaddress => params[:srcaddress],
          :ismanual => params[:ismanual],
          :latitude => params[:latitude],
          :longitude => params[:longitude]
        })
      
      render :text => {"success" => true, "id" => params[:id]}.to_json
    end
  end
  
  def index
  end
	
  def get_megaport_agents
    agents = AgentGroup.find_by_name("Агенты Мегапорт").agents
    mega = {:id => 0, :name => "Все агенты"}
    
    render :text => agents.insert(0, mega).to_json(:only => [:id, :name])
  end
end
  