# encoding: utf-8
class Placeunload::LinksCleaningController < ApplicationSimpleErrorController
  def index
  end

  def get_buyers
    res =  ActiveRecord::Base.connection.select_all("
    call placeunload_links_cleaning_get_buyers(
    '#{Time.parse(params[:ddateb]).strftime('%F')}',
    '#{Time.parse(params[:ddatee]).strftime('%F')}',
    #{params[:site_id].to_i})")

    render :text => res.to_json
  end
  
  def get_placeunloads
    buyers = params[:master_id].split(",")
    buyers.collect! {|b| b.to_i}
    res =  ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      address name
    FROM
      placeunload
    WHERE
      id IN (
      SELECT
        b.placeunload_id
      FROM
        buyers b
      WHERE
        b.id IN (#{ActiveRecord::Base.connection.quote_string(buyers.join(","))}))
    ORDER BY
      name")

    render :text => res.to_json
  end
  
  def clean
    json_params = ActiveSupport::JSON.decode(request.body.gets)
    buyers = json_params["buyers"].split(",").collect! {|b| {"id" => b.to_i}}.to_xml(:root => "buyers")
    placeunloads = json_params["placeunloads"].collect! {|p| {"id" => p.to_i}}.to_xml(:root => "placeunloads")
    main_placeunload = json_params["main_placeunload"].to_i
    
    ActiveRecord::Base.connection.execute("call placeunload_links_cleaning_clean(
      #{ActiveRecord::Base.connection.quote(buyers)},
      #{ActiveRecord::Base.connection.quote(placeunloads)},
      #{main_placeunload}
    )")
    render :text => {"success" => true}.to_json
  end
end