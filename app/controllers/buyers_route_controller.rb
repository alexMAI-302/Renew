# encoding: utf-8

class BuyersRouteController < ApplicationPageErrorController
  def index
    set_conditions
    rst_site = ActiveRecord::Base.connection.select_all( "select id, name from site where istarget = 1 " )
    @site_list = rst_site.collect {|p| [ p["name"], p["id"] ] }

    rst_spv = ActiveRecord::Base.connection.select_all( " select id, name from sp_values where sp_tp = 1284 " )
    @spv_list = rst_spv.collect {|p| [ p["name"], p["id"] ] }

    rst_route = ActiveRecord::Base.connection.select_all(
    " select id, name, points from buyers_route where site = #{@site} and spv_id = #{@spv_id} order by name " )
    @route_list = []
    @route_index = 0
    @route_id = session[:route_id].to_i
    @route_id = 0 if not @route_id
    rst_route.each_with_index do |p,i|
      @route_list << [ p["name"], i ]
      @route_index = i if @route_id == p["id"]
    end
    if rst_route.size > 0
      @route_id = rst_route[@route_index]["id"]
      @route_points = rst_route[@route_index]["points"]
    else
      @route_id = 0
      @route_points = ""
    end
    @route_json = rst_route.to_json( :only => [ "id", "points", "name" ] )
    rst_buyers = ActiveRecord::Base.connection.select_all("
    select distinct
      g.id id,
      g.latitude latitude,
      g.longitude longitude
    from
      placeunload g")

    @rst_new = rst_buyers.to_json( :only => [ "id", "longitude", "latitude" ] )
  end

  def save_point
    if params[:a]
      @route_id = params[:a][:routeid]
      session[:route_id] = @route_id
      r = BuyersRoute.find( @route_id )
      r.points = params[:a][:points]
      r.save

      single_strings=params[:a][:points_str].split(';')
      query_insert_points=""
      single_strings.each_with_index do |single_string|
        query_insert_points+="INSERT INTO geozone_coordinates (id, buyers_route, number, longitude, latitude) VALUES(idgenerator('geozone_coordinates'), #{@route_id}, #{single_string});"
      end

      ActiveRecord::Base.connection.execute("
    DELETE FROM geozone_coordinates WHERE buyers_route=#{@route_id};
    #{query_insert_points}")
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
      data=data.concat(ActiveRecord::Base.connection.select_all("
      SELECT
        p.id partner_id,
        p.name partner_name,
        p.parent partner_group_id,
        (SELECT
          name
        FROM
          partners_groups
        WHERE
          id = p.parent) partner_group_name,
        b.id buyer_id,
        b.name buyer_name,
        b.loadto loadto,
        p.id placeunload_id,
        br.id buyers_route_id,
        br.name buyers_route_name
      FROM
        partners p
        JOIN buyers b ON b.partner = p.id
        JOIN placeunload pl ON pl.id = b.placeunload_id
        JOIN buyers_route br ON br.id = pl.buyers_route_id
      WHERE
        pl.id IN ('#{points[i .. i+pack].join(",")}')"))
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
