# encoding: utf-8
class PlaceunloadScheduleController < ApplicationSimpleErrorController
  def index
  end

  def get
    res=Proxycat.connection.select_all("
    exec dbo.placeunload_schedule_get
    #{params[:salesman_id].to_i},
    '#{Time.parse(params[:ddate]).strftime('%F')}'")

    render :text => res.to_json
  end

  def save
    day_of_week=params[:day_of_week].to_i
    if day_of_week>=1 && day_of_week<=5
      Proxycat.connection.execute("
      	exec dbo.placeunload_schedule_save
      		#{params[:id].to_i},
      		#{params[:day_of_week].to_i},
      		'#{Time.parse(params[:ddate]).strftime('%F')}',
      		#{params[:site_id].to_i}")
    end

    render :text => "[]"
  end

  def get_salesman
    res = Proxycat.connection.select_all("exec placeunload_schedule_get_salesman '#{Proxycat.connection.quote_string(params[:query])}'")

    render :text => res.to_json
  end
end