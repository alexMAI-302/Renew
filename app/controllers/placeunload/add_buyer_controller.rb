# encoding: utf-8
class Placeunload::AddBuyerController < ApplicationSimpleErrorController
  def get_partners_groups
    pname = params[:query]
    if pname != ''
      pname = " AND name like '%#{ActiveRecord::Base.connection.quote_string(pname)}%'"
    end

    res = ActiveRecord::Base.connection.select_all("
    select top #{params[:limit].to_i}
      id,
      name,
      (select
        list(i.name, '/' order by  i.tlev )
      from
        partners_groups_tree pgt
        join partners_groups  i on i.id = pgt.parent
      where
        pgt.id = partners_groups.id and  i.tlev > 0  and pgt.id <> pgt.parent
      ) tip
    from
      partners_groups
      WHERE
        name NOT LIKE 'Архив_%' #{pname}
    order by
      2")

    render :text => res.to_json
  end

  def get_partners
    pname = params[:query]
    pgid  = params[:partner_group_id]

    if pname != ''
      pname = " and p.name like '%#{ActiveRecord::Base.connection.quote_string(pname)}%' "
    end

    partners_time = {"Водители ООРТ" => 15, "Водители ОПТ" => 30, "VIP" => 60}

    res = ActiveRecord::Base.connection.select_all( "
    select top #{params[:limit].to_i}
      p.id id,
      p.name name,
      ( select list(i.name, '/' order by  i.tlev )
        from  partners_groups_tree pgt join partners_groups  i on i.id = pgt.parent
        where pgt.id = p.parent and  i.tlev > 0
      ) tip,
      sp_v.name unloading
    from
      partners p
      LEFT JOIN partners_sp_sets p_sp_s ON p.id=p_sp_s.partner
      LEFT JOIN sp_types sp_t ON p_sp_s.sp_tp=sp_t.id
      LEFT JOIN sp_values sp_v ON sp_v.id=p_sp_s.spv_id
    where
      (sp_t.name='Тариф' OR p_sp_s.partner IS NULL)
      AND
      p.parent in (select id from partners_groups_tree where parent = #{pgid.to_i}) #{pname}
    order by
      2")

    res.each do |r|
      r["unloading"] = partners_time[r["unloading"]]
    end

    render :text => res.to_json
  end

  def get_buyers
    bname = params[:query]
    pid  = params[:partner_id]

    if bname != ''
      bname = " and b.name like '%#{ActiveRecord::Base.connection.quote_string(bname)}%' "
    end

    res =  ActiveRecord::Base.connection.select_all("
    select
      b.id id,
      b.name name,
      b.loadto loadto
    from
      buyers b
    where
      b.partner = #{pid.to_i} #{bname}
    order by
      2")

    render :text => res.to_json
  end

  def get_placecategories
    res = ActiveRecord::Base.connection.select_all("select id, name from placecategory where id<>-1 order by name")

    render :text => res.to_json
  end

  def get_schedules
    res = ActiveRecord::Base.connection.select_all("select id, name from schedule order by name")

    render :text => res.to_json
  end

  def get_routes
    res = ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      name,
      points
    FROM
      buyers_route
    ORDER BY
      name")

    render :text => res.to_json
  end

  def get_placeunloads
    res = ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      name,
      latitude,
      longitude,
      address,
      fulladdress,
      descr,
      (select
        list(g2.name)
      from
        partners_groups g2
        join partners_groups g1 on g1.parent = g2.id
        join partners p on g1.id = p.parent
        join buyers b on b.partner = p.id
      where
        b.placeunload_id = placeunload.id ) tp
      FROM
        placeunload
      WHERE
        dbo.dist_between_points (latitude, longitude, #{params[:latitude].to_f}, #{params[:longitude].to_f}) < getuseroption('renew_dist')
      order by
        2" )

    render :text => res.to_json
  end

  def get_sites
    sites=ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      name,
      latitude,
      longitude
    FROM
      site
    WHERE
      latitude IS NOT NULL
      AND
      longitude IS NOT NULL")
    render :text => sites.to_json
  end

  def index
    partners_time = {"Водители ООРТ" => 15, "Водители ОПТ" => 30, "VIP" => 60}
    if params[:partner]
      @partner_id = params[:partner].to_i
      pa = ActiveRecord::Base.connection.select_one("
      SELECT
        p.name partner_name,
        p.parent pgroup_id,
        (select name from partners_groups where id = p.parent) pgroup_name,
        (SELECT
          sp_v.name
        FROM
          partners_sp_sets p_sp_s
          LEFT JOIN sp_types sp_t ON p_sp_s.sp_tp=sp_t.id
          LEFT JOIN sp_values sp_v ON sp_v.id=p_sp_s.spv_id
        WHERE
          p.id=p_sp_s.partner
          and
          sp_t.name='Тариф') spv_name
      FROM
        partners p
      WHERE
        p.id = #{@partner_id}")

      @partner_group_id   = pa["pgroup_id"].to_i
      @partner_group_name = pa["pgroup_name"]
      @partner_name = pa["partner_name"]
      @buyer_name   = @partner_name
      @placeunload_name = @partner_name

      @unloading=partners_time[pa["spv_name"]]
    elsif params[:buyer]
      @buyer_id = params[:buyer].to_i

      pa = ActiveRecord::Base.connection.select_one("
      select
        p.id partner_id,
        p.name partner_name,
        p.parent pgroup_id,
        (select
          name
        from
          partners_groups where id = p.parent) pgroup_name,
        b.name buyer_name,
        b.loadto loadto,
        b.placeunload_id placeunload_id,
        pl.longitude longitude,
        pl.latitude latitude,
        pl.fulladdress,
        pl.descr,
        ISNULL(pl.unloading, -1) unloading,
        (select
          list(g2.name)
        from
          partners_groups g2
          join partners_groups g1 on g1.parent = g2.id
        where
          g1.id = p.parent) tp
      from
        partners p
        join buyers b on b.partner = p.id
        left outer join placeunload pl on pl.id = b.placeunload_id
      where
        b.id = #{@buyer_id}")

      @partner_group_id      = pa["pgroup_id"].to_i
      @partner_group_name    = pa["pgroup_name"]
      @partner_id     = pa["partner_id"].to_i
      @partner_name   = pa["partner_name"]
      @buyer_name     = pa["buyer_name"]
      @loadto         = pa["loadto"]
      @fulladdress     = pa["fulladdress"]
      @placeunload_id = pa["placeunload_id"].to_i
      @placeunload_name = pa["buyer_name"]
      @latitude  = pa["latitude"]
      @longitude = pa["longitude"]
      @tp        = pa["tp"]
      @descr     = pa["descr"]
      @unloading     = pa["unloading"]
    end
  end

  def save_buyer
    data=ActiveSupport::JSON.decode(request.body.gets)
    dow = 0
    data["dow"].each do |day|
      dow+=1<<(day.to_i-1)
    end

    begin    
      serr = ActiveRecord::Base.connection.select_value("
        call renew_web.placeunload_save_buyer(
          #{data["partner_group_id"].to_i},
          #{data["partner_id"].to_i},
          '#{ActiveRecord::Base.connection.quote_string(data["partner_name"].strip)}',
          #{data["buyer_id"].to_i},
          '#{ActiveRecord::Base.connection.quote_string(data["buyer_name"].strip)}',
          #{data["placeunload_id"].to_i},
          '#{ActiveRecord::Base.connection.quote_string(data["placeunload_name"].strip)}',
          '#{ActiveRecord::Base.connection.quote_string(data["loadto"].strip)}',
          '#{ActiveRecord::Base.connection.quote_string(data["fulladdress"])}',
          #{data["latitude"].to_f},
          #{data["longitude"].to_f},
          '#{ActiveRecord::Base.connection.quote_string(data["placeunload_descr"].strip)}',
          #{data["placeunload_unloading"]=="-1" ? 'null' : data["placeunload_unloading"].to_i},
          #{data["placeunload_delscheduleid"].to_i},
          #{data["placeunload_incscheduleid"].to_i},
          #{data["placeunload_buyers_route_id"]=="-1" ? 'null' : data["placeunload_buyers_route_id"].to_i},
          #{data["placeunload_placecategory_id"].to_i},
          #{dow}
          )
      ")
            
      if !serr.nil? && serr.size==0
        render :text => "ok"
      else
        render :text => serr
      end
    rescue => t
      render :text => t
    end
  end
end