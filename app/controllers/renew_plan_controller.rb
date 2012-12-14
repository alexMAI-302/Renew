# encoding: utf-8

class RenewPlanController < ApplicationSimpleErrorController
  def get_renew_plans
    ddateb=Time.parse(params[:ddateb]).strftime('%F')
    ddatee=Time.parse(params[:ddatee]).strftime('%F')
    renew_plans = ActiveRecord::Base.connection.select_all("call renew_plan_get('#{ddateb}', '#{ddatee}')")

    render :text => renew_plans.to_json
  end

  def get_site_to_storages
    site_storages=ActiveRecord::Base.connection.select_all("
  	SELECT
  	 sts.id,
  	 s.name storage_name,
  	 sts.site_to,
  	 sts.site_from
  	FROM
  	 site_to_storages sts
  	 JOIN storages s ON sts.client_id=-s.id
  	ORDER BY
  	 sts.id")

    render :text => site_storages.to_json
  end

  def index
  end

  def get_refreshddate
    refreshddate = ActiveRecord::Base.connection.select_value('select max(ts) from dbo.eremsite')
    render :text => {:refresh_ddate => refreshddate}.to_json
  end

  def do_plan
    r = ActiveRecord::Base.connection.select_value("call renew_plan_plan(#{params[:id].to_i});")
    
    render :text => {:res => r}.to_json
  end

  def do_sorder
    renew_plan_id=params[:id].to_i
    site_to_storage=params[:site_to_storage].to_i

    r = ActiveRecord::Base.connection.select_value("call renew_plan_do_sorder(#{renew_plan_id}, #{site_to_storage});")

    render :text => (r.to_i==2)?("lackvol"):"ok"
  end

  def do_sorder_status1
    begin
      ActiveRecord::Base.connection.exec("call renew_plan_update_status1(#{params[:id].to_i})")

      render :text => {"success" => true}.to_json
    rescue => t
      render :text => t, :status => 500
    end
  end
end