# encoding: utf-8

class RenewPlanController < ApplicationSimpleErrorController
  def renew_plan
    method=request.method.to_s
    if method == "get"
      ddateb=Time.parse(params[:ddateb]).strftime('%F')
      ddatee=Time.parse(params[:ddatee]).strftime('%F')
      res = ActiveRecord::Base.connection.select_all("call renew_plan_get('#{ddateb}', '#{ddatee}')")

      render :text => res.to_json
    else
      id=ActiveRecord::Base.connection.select_value("call renew_plan_modify(
        #{params[:id].to_i},
        '#{request.method.to_s}',
        #{ActiveRecord::Base.connection.quote(params.to_xml(:root => 'params', :dasherize => false))})")

      render :text => {"success" => true, "id" => id}.to_json
    end
  end

  def renew_plan_goods
    method=request.method.to_s
    case method
    when "get"
      res=ActiveRecord::Base.connection.select_all("
      call renew_plan_renew_plan_goods_get(
        #{params[:master_id].to_i},
        #{params[:seller_id].to_i}
      )")
      render :text => res.to_json
    when "post"
      rpgs=ActiveSupport::JSON.decode(request.body.gets)
      if Array.try_convert(rpgs).nil?
        rpgs=[rpgs]
      end
      items=rpgs.to_xml(:root => "renew_plan_goods")
      res = ActiveRecord::Base.connection.select_all("
      call renew_web.renew_plan_goods_ins(
      #{ActiveRecord::Base.connection.quote(items)},
      #{params[:master_id].to_i})")

      render :text => res.to_json
    when "put"
      rpgs=ActiveSupport::JSON.decode(request.body.gets)
      if Array.try_convert(rpgs).nil?
        rpgs=[rpgs]
      end
      items=rpgs.to_xml(:root => "renew_plan_goods")
      res = ActiveRecord::Base.connection.select_all("
      call renew_web.renew_plan_goods_upd(#{ActiveRecord::Base.connection.quote(items)})")

      render :text => {"success" => true}.to_json
    when "delete"
      rpgs=ActiveSupport::JSON.decode(request.body.gets)
      if Array.try_convert(rpgs).nil?
        rpgs=[rpgs]
      end
      items=rpgs.to_xml(:root => "renew_plan_goods")
      ActiveRecord::Base.connection.execute("
      call renew_web.renew_plan_goods_del(#{ActiveRecord::Base.connection.quote(items)})")

      render :text => {"success" => true}.to_json
    end
  end
  
  def get_goods
    goods_names=ActiveSupport::JSON.decode(request.body.gets)["goods"]
    items=goods_names.to_xml(:root => "goods")

    res = ActiveRecord::Base.connection.select_all("
    call renew_web.renew_plan_goods_get_goods(#{ActiveRecord::Base.connection.quote(items)})")
    
    render :text => res.to_json
  end

  def get_sites
    res=ActiveRecord::Base.connection.select_all("
    SELECT
      s.id,
      s.name
    FROM
      site s
    WHERE
      s.id IN (SELECT site_to FROM site_to_storages UNION ALL SELECT site_to FROM site_to_storages)
    ORDER BY
      s.id")

    render :text => res.to_json
  end

  def get_sellers
    res=ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      name
    FROM
      ask_ddw_renew_partners()")

    render :text => res.to_json
  end

  def get_lggroups
    res=ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      name
    FROM
      lggroup
    ORDER BY
      name")

    render :text => res.to_json
  end

  def get_renew_plan_types
    res=ActiveRecord::Base.connection.select_all("
  	SELECT
  	 id,
  	 name
  	FROM
  	 renew_plan_type
  	ORDER BY
  	 id")

    render :text => res.to_json
  end

  def get_site_to_storages
    res=ActiveRecord::Base.connection.select_all("
    SELECT
     sts.id,
     s.name,
     sts.site_to,
     sts.site_from,
     sts.selected
    FROM
     site_to_storages sts
     JOIN storages s ON sts.client_id=-s.id
    ORDER BY
     sts.id")

    render :text => res.to_json
  end

  def index
  end

  def do_plan
    r = ActiveRecord::Base.connection.select_value("call renew_plan_plan(
      #{params[:id].to_i},
      #{params[:renew_plan_type_id]});")

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
      ActiveRecord::Base.connection.execute("call renew_plan_update_status1(#{params[:id].to_i})")

      render :text => {"success" => true}.to_json
    rescue => t
      render :text => t, :status => 500
    end
  end
end