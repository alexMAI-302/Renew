# encoding: utf-8
class PricesForComparisonController < ApplicationSimpleErrorController
  def index
  end

  def prices_for_comparison
    method=request.method.to_s
    case method
    when "get"
      rs = PricesForComparison.find (:all)
      render :text => rs.to_json
    when "post"
      pr = PricesForComparison.new(
      :svip=>params[:svip],
      :vip=>params[:vip],
      :lstop=>params[:lstop],
      :linput=>params[:linput],
      :ort1=>params[:ort1],
      :ort2=>params[:ort2],
      :ort3=>params[:ort3],
      :ort4=>params[:ort4],
      :ort5=>params[:ort5],
      :ort6=>params[:ort6],
      :lggroup=>params[:lggroup],
      :comm=>params[:comm]
      )
      pr.id = ActiveRecord::Base.connection.select_value("SELECT idgenerator('renew_web.prices_for_comparison')")
      pr.save

      render :text => {"success" => true, "id" => pr.id}.to_json
    when "put"
      id = params[:id].to_i
      PricesForComparison.update(
      id,
      {
        :svip=>params[:svip],
        :vip=>params[:vip],
        :lstop=>params[:lstop],
        :linput=>params[:linput],
        :ort1=>params[:ort1],
        :ort2=>params[:ort2],
        :ort3=>params[:ort3],
        :ort4=>params[:ort4],
        :ort5=>params[:ort5],
        :ort6=>params[:ort6],
        :lggroup=>params[:lggroup],
        :comm=>params[:comm]

      }
      )

      render :text => {"success" => true}.to_json

    when "delete"
      id =params[:id].to_i
      PricesForComparison.delete (id);
      render :text => {"success" => true}.to_json
    end
  end

  def get_lggroup
    rs = ActiveRecord::Base.connection.select_all("select id, name from lggroup order by name")
    render :text => rs.to_json
  end

  def get_pricelist
    rs=Pricelist.find(:all,
    :select => "id, name",
    :order => "name")
    render :text => rs.to_json
  end

end
