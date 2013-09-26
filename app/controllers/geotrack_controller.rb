# encoding: utf-8

class GeotrackController < ApplicationSimpleErrorController
  def get_tracks
    ddate=Time.parse(params[:ddate]).strftime('%F')
    rst = ActiveRecord::Base.connection.select_all("
    call dbo.geotrack_get_routepoints(
      '#{ddate}',
      '#{ddate}',
      #{params[:agent_id].to_i})")

    current_track = nil
    tracks=[]
    rst.each do |point|
      if current_track.nil? || current_track[:id] != point["track_id"]
        current_track = {
          :id => point["track_id"],
          :start_time => Time.parse(point['start_time']),
          :finish_time => Time.parse(point['finish_time']),
          :track_distance => point['track_distance'],
          :points => []
        }
        tracks << current_track
      end

      current_track[:points] << {latitude: point["latitude"], longitude: point["longitude"], ts: point["real_ts"]}
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

  def get_terminals
    ddate=Time.parse(params[:ddate]).strftime('%F')
    rst = ActiveRecord::Base.connection.select_all("
    SELECT
      terminal id,
      code,
      terminalid,
      longitude,
      latitude,
      cts_ok,
      ok_distance,
      ok_longitude,
      ok_latitude
    FROM
      dbo.geotrack_get_terminals_with_ok(
      '#{ddate}',
      '#{ddate}',
      #{params[:agent_id].to_i})")

    render :text => rst.to_json
  end

  def index
  end
end
