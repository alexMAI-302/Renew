# encoding: utf-8

class GeotrackController < ApplicationPageErrorController
  def route_points
    rst = ActiveRecord::Base.connection.select_all("
    call renew_web.geotrack_get_routepoints(
      '#{Time.parse(params[:ddate]).strftime('%F')}',
      '#{params[:agent_id].to_i}')")

    render :text => rst.to_json
  end

  def get_agents
    rst = ActiveRecord::Base.connection.select_all("
    call renew_web.geotrack_get_agents('#{Time.parse(params[:ddate]).strftime('%F')}')")

    render :text => rst.to_json
  end

  def index
  end
end
