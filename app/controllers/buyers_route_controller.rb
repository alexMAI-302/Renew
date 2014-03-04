# encoding: utf-8

class BuyersRouteController < ApplicationPageErrorController
  def index
  end
  
  def get_sites
    res = ActiveRecord::Base.connection.select_all("
    select
      id,
      name,
      latitude,
      longitude
    from
      site
    where
      istarget = 1")
    
    render :text => res.to_json
  end
  
  def get_placeunload
    res = ActiveRecord::Base.connection.select_all("
    select distinct
      p.id,
      p.latitude,
      p.longitude
    from
      placeunload p
      join buyers_route br on br.id = p.buyers_route_id
    where
      br.spv_id = (SELECT id FROM sp_values where sp_tp = 1284 and name = 'Водители ООРТ')")
    
    render :text => res.to_json
  end
  
  def buyers_routes
    method=request.method.to_s
    case method
    when "get"
      res = ActiveRecord::Base.connection.select_all(
      "select
        br.id,
        br.name,
        s.id site_id,
        s.name site_name,
        s.latitude site_latitude,
        s.longitude site_longitude,
        br.points
      from
        buyers_route br
        JOIN site s ON s.id=br.site
      where
        br.spv_id = (SELECT id FROM sp_values where sp_tp = 1284 and name = 'Водители ООРТ')
      order by
        s.id,
        br.name")
      
      render :text => res.to_json
    when "put"
      route_id = params[:id].to_i
      data=ActiveSupport::JSON.decode(request.body.gets)
      r = BuyersRoute.find( route_id )
      r.points = params[:points]
      r.save

      single_strings=params[:points_str].split(';')
      query_insert_points=""
      single_strings.each_with_index do |single_string|
        query_insert_points+="
        INSERT INTO geozone_coordinates (id, buyers_route, number, latitude, longitude)
        VALUES(idgenerator('geozone_coordinates'), #{route_id}, #{ActiveRecord::Base.connection.quote_string(single_string)});"
      end

      ActiveRecord::Base.connection.execute("
      DELETE FROM geozone_coordinates WHERE buyers_route=#{route_id};
      #{query_insert_points}")
      
      render :text => {"success" => true, "site_id" => data["site_id"]}.to_json
    end
  end
  
  def rebuild_placeunload_routes
    if request.method.to_s=="post"
      ActiveRecord::Base.connection.execute("call renew_web.buyers_route_rebuild_placeunload_routes();")
      
      render :text => {"success" => true}.to_json
    end
  end

  #выгрузка файла с точками
  def get_info_csv
    data=ActiveRecord::Base.connection.select_all("
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
        b.spv_id = (SELECT id FROM sp_values where sp_tp = 1284 and name = 'Водители ООРТ')
        AND
        pl.id IN (#{ActiveRecord::Base.connection.quote_string(params[:points])})")

    send_data(
		data.collect {|point| "#{point["partner_group_name"]}\t#{point["partner_name"]}\t#{point["buyer_name"]}\t#{point["loadto"]}\t#{point["buyers_route_name"]}"}.join("\n"),
		:filename => "points.csv",
		:type => 'text/csv')
  end
end
