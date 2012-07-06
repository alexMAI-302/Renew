# encoding: utf-8
class PlaceunloadScheduleController < ApplicationController
  def index
  end
  
  def get
	res=Proxycat.connection.select_all("exec dbo.placeunload_schedule_get #{params[:salesman_id].to_i}")
			
	render :text => res.to_json
  end
  
  def save
	Proxycat.connection.execute("
	exec dbo.placeunload_schedule_save
		#{params[:id].to_i},
		#{Proxycat.connection.quote(params[:monday])},
		#{Proxycat.connection.quote(params[:tuesday])},
		#{Proxycat.connection.quote(params[:wednesday])},
		#{Proxycat.connection.quote(params[:thursday])},
		#{Proxycat.connection.quote(params[:friday])},
		#{params[:site_id].to_i}")
			
		render :text => "[]"
  end
  
  def get_salesman
	res = Proxycat.connection.select_all("exec placeunload_schedule_get_salesman '#{Proxycat.connection.quote_string(params[:query])}'")
	
	render :text => res.to_json
  end
end