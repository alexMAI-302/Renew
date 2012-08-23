# encoding: utf-8

class BuyersRouteController < ApplicationPageErrorController
  
  def index
	set_conditions
	@rst_site = ActiveRecord::Base.connection.select_all( "select id, name from site where istarget = 1 " )
	@site_list = @rst_site.collect {|p| [ p["name"], p["id"] ] }

	@rst_spv = ActiveRecord::Base.connection.select_all( " select id, name from sp_values where sp_tp = 1284 " )
	@spv_list = @rst_spv.collect {|p| [ p["name"], p["id"] ] }

	@rst_route = Proxycat.connection.select_all("exec buyers_route_get_route
		#{@site},
		#{@spv_id}")
	
	@route_list = []
	@route_index = 0
	@route_id = session[:route_id].to_i 
	@route_id = 0 if not @route_id
	@rst_route.each_with_index do |p,i| 
		@route_list << [ p["name"], i ]
		@route_index = i if @route_id == p["id"]
	end
	if @rst_route.size > 0
		@route_id = @rst_route[@route_index]["id"]
		@route_points = @rst_route[@route_index]["points"]
	else
		@route_id = 0
		@route_points = ""
	end 
	@route_json = @rst_route.to_json( :only => [ "id", "points", "name" ] )
	@rst_buyers = Proxycat.connection.select_all("exec buyers_route_get_buyers") 
															
	@rst_new = @rst_buyers.to_json( :only => [ "id", "longitude", "latitude" ] ) 
  end
  
  def save_point
	if params[:a]
		@route_id = params[:a][:routeid]
		session[:route_id] = @route_id

		single_strings=params[:a][:points_str].split(';')
		query_insert_points=""
		single_strings.each_with_index do |single_string|
			query_insert_points+="\nINSERT INTO geozone_coordinates (id, buyers_route, number, longitude, latitude) VALUES(idgenerator(''geozone_coordinates''), #{@route_id}, #{single_string});"
		end
		
		Proxycat.connection.execute("exec buyers_route_save_point
			#{@route_id},
			'#{params[:a][:points]}',
			'#{query_insert_points}'")
	end
	redirect_to :action => "index"
  end
  
  #выгрузка файла с точками
  def get_info_csv
	pack=500
	points=params[:points].split(",")
	data=[]
	i=0
	while i*pack < points.length
		data=data.concat(Proxycat.connection.select_all("exec buyers_route_get_placeunload_info '#{points[i .. i+pack].join(",")}'"))
		i=i+1
	end
	
	send_data(
		data.collect {|point| "#{point["partner_group_name"]}\t#{point["partner_name"]}\t#{point["buyer_name"]}\t#{point["loadto"]}\t#{point["buyers_route_name"]}"}.join("\n"),
		:filename => "points.csv",
		:type => 'text/csv')
  end

private

  def set_conditions
	@site = 1
	@spv_id = 4284
	if params[:post] 
		@site = params[:post][:site].to_i
		session[:site]  = @site
		@spv_id = params[:post][:spv_id].to_i
		session[:spv_id]  = @spv_id
	else
		@site = session[:site] if session[:site]
		@spv_id = session[:spv_id] if session[:spv_id]
	end
  end
end
  