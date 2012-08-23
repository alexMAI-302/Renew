class GeoRouteController < ApplicationPageErrorController
  
  def index
	@rst = ActiveRecord::Base.connection.select_all("
	select
		latitude,
		longitude,
		srcaddress srca
	from
		geoaddress
	where
		latitude is not null and longitude is not null and srcaddress is not null")
	
  end

 end