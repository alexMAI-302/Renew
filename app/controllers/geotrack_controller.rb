# encoding: utf-8

class GeotrackController < ApplicationPageErrorController
  def get_tracks
    rst = ActiveRecord::Base.connection.select_all("
    call renew_web.geotrack_get_routepoints(
      '#{Time.parse(params[:ddate]).strftime('%F')}',
      '#{params[:agent_id].to_i}')")
    
    current_track = nil
    tracks=[]
    rst.each do |point|
      if current_track.nil? || current_track[:id] != point["id"]
        current_track = {
          :id => point["id"],
          :start_time => Time.parse(point['startTime']),
          :finish_time => Time.parse(point['finishTime']),
          :points => []
        }
        tracks << current_track
      end
      
      current_track[:points] << {:latitude => point["latitude"], :longitude => point["longitude"]}
    end
    
    tracks.each do |track|
      track[:points_quantity] = (track[:points].nil?)? 0 : track[:points].length
    end

    render :text => tracks.to_json
  end

  def get_agents
    rst = ActiveRecord::Base.connection.select_all("
    call renew_web.geotrack_get_agents('#{Time.parse(params[:ddate]).strftime('%F')}')")

    render :text => rst.to_json
  end

  def index
  end
end
