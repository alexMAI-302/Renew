# encoding: utf-8
class ConvertBase64Controller < ApplicationPageErrorController
  def index

  end

  def points_string_get
    site=params['site'].to_i
    if site>0 then
      @points_strings=Proxycat.connection.select_all("
      EXEC get_data_site
      'SELECT
        buyers_route,
        pps_zone,
        ''[''+list(''[''+CONVERT(varchar(30), latitude)+'', ''+CONVERT(varchar(30), longitude)+'']'' ORDER BY gc.number)+'']'' points_string
      FROM
        geozone_coordinates gc
      GROUP BY
        gc.buyers_route,
        gc.pps_zone',
      #{site}")
    end
    
    render :partial => "points"
  end

  def points_string_save
    zones=params['new_value']
    buyers_routes=params['buyers_route']
    pps_zones=params['pps_zone']
    site=params[:site].to_i
    if site>0 then
      zones.each_key do |i|
        Proxycat.connection.execute("
        EXEC iud_data_site
        'UPDATE #{buyers_routes[i].to_i>0 ? 'buyers_route' : 'pps_zone'}
        SET points=''#{zones[i]}''
        WHERE id=#{buyers_routes[i].to_i>0 ? buyers_routes[i].to_i : pps_zones[i].to_i}',
        #{site}")
      end
    end
    render :text => 'ok'
  end

end