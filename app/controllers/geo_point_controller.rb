class GeoPointController < ApplicationPageErrorController
  
  def geo_points
    method=request.method.to_s
    case method
    when "get"
      str_cond = "pt.isdeleted = 0 AND ttp.enabled = 1 AND pt.main_subdealerID = #{params[:subdealer]} "
      str_cond += " and (g.latitude is not null) " if params[:point_kind].to_i == 3
      str_cond += " and (g.latitude is null) " if params[:point_kind].to_i == 1
      if !params[:filter_str].nil? && params[:filter_str].size > 0
        str_cond += " and (pt.name like '%#{params[:filter_str]}%' OR pt.address like '%#{params[:filter_str]}%')"
      end
      if !params[:terminal_id].nil? && params[:terminal_id].size > 0
        str_cond += " and pt.terminalID=#{params[:terminal_id].to_i}"
      end
      
      rst = Geoaddress.find(
        :all,
        :select => "
        g.id,
        pt.terminalID,
        pt.code,
        pt.name,
        pt.address taddress,
        g.fulladdress,
        g.srcaddress,
        g.latitude,
        g.longitude,
        g.ismanual,
        g.city",
        :from => "geoaddress g",
        :joins => "JOIN pps_terminal pt ON g.id=pt.geoaddressid
        JOIN terminal_type ttp ON ttp.ttp_id = pt.ttp_id",
        :conditions => str_cond,
        :order => 'pt.address')
        
      render :text => rst.to_json
    when "put"
      Geoaddress.update(
        params[:id],
        {
          :taddress_old => params[:taddress],
          :fulladdress => params[:fulladdress],
          :srcaddress => params[:srcaddress],
          :ismanual => params[:ismanual],
          :latitude => params[:latitude],
          :longitude => params[:longitude]
        })
      
      render :text => {"success" => true, "id" => params[:id]}.to_json
    end
  end
  
  def index
	end
end
  