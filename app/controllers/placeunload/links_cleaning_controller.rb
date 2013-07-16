# encoding: utf-8
class Placeunload::LinksCleaningController < ApplicationSimpleErrorController
  def index
  end

  def get_deliveries
    res =  ActiveRecord::Base.connection.select_all("
    call placeunload_links_cleaning_get_deliveries(
    '#{Time.parse(params[:ddateb]).strftime('%F')}',
    '#{Time.parse(params[:ddatee]).strftime('%F')}',
    #{params[:site_id].to_i})")

    render :text => res.to_json
  end
  
  def get_placeunloads
    id_array = params[:master_id].split("_")
    res =  ActiveRecord::Base.connection.select_all("
    call placeunload_links_cleaning_get_placeunloads(
    #{id_array[0].to_i},
    #{id_array[1].to_i})")
    render :text => res.to_json
  end
  
  def clean
    json_params = ActiveSupport::JSON.decode(request.body.gets)
    placeunloads = json_params["placeunloads"].to_xml(:root => "placeunloads")
    
    ActiveRecord::Base.connection.execute("call placeunload_links_cleaning_clean(
      #{ActiveRecord::Base.connection.quote(placeunloads)},
      #{params["main_placeunload"].to_i}
    )")
    render :text => {"success" => true}.to_json
  end
end