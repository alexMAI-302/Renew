# encoding: utf-8

class TechrequestCreateController < ApplicationSimpleErrorController

  def index
  end

  def techrequest_get_terminals
    method=request.method.to_s
    case method
    when "get"
      pval_zonetypeid = params[:param_zonetypeid].to_s
      pval_zonetypeid= (pval_zonetypeid==""? "null": pval_zonetypeid)
      
      pval_zoneid = (params[:param_zoneid].to_s)
      pval_zoneid = (pval_zoneid==""? "null": pval_zoneid)
      
      pval_prefix = params[:param_prefix].to_s
      pval_prefix= ( pval_prefix==""? "null": "'#{pval_prefix}'" )
      
      query = "call renew_web.ask_techrequest_terminals(
        #{pval_zonetypeid},
        #{pval_zoneid},
        #{pval_prefix} ) ";
        
      res = ActiveRecord::Base.connection.select_all(query);
      render :text => res.to_json;
    end
  end
    
  def techrequest_create_entries
    method=request.method.to_s
    case method
    when "post"
      rpgs=ActiveSupport::JSON.decode(request.body.gets)
      if Array.try_convert(rpgs).nil?
        rpgs=[rpgs]
      end
      items=rpgs.to_xml(:root => "techrequest_create_entries")
      res = ActiveRecord::Base.connection.select_all("
      call dbo.prc_create_techrequests(
          #{params[:requesttype_id].to_i},
          #{params[:zone_id].to_i},
          #{ActiveRecord::Base.connection.quote(items)})");

      render :text => {"success" => true}.to_json
    end
  end
  
  def techrequest_get_zonetypes
    method=request.method.to_s
    case method
    when "get"      
      query = "
      SELECT 
        id, name
       FROM sp_values
       WHERE sp_tp=1626"
        
      res = ActiveRecord::Base.connection.select_all(query)
      render :text => res.to_json
    end
  end
  
  def techrequest_get_zones
    method=request.method.to_s
    case method
    when "get"      
      query = "
      SELECT
        id, name, spv_id zone_type
       FROM pps_zone
       ORDER BY name ASC"
        
      res = ActiveRecord::Base.connection.select_all(query)
      render :text => res.to_json
    end
  end
  
  def techrequest_get_requesttypes
    method=request.method.to_s
    case method
    when "get"      
      query = "
      SELECT
        id, name
       FROM dbo.techrequest_type
       ORDER BY name ASC"
        
      res = ActiveRecord::Base.connection.select_all(query)
      render :text => res.to_json
    end
  end
end