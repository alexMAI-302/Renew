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
      call dbo.ask_dw_renew_plan_goods(
        #{params[:master_id].to_i},
        #{params[:lggroup_id].to_i},
        0,
        #{params[:seller_id].to_i}
      )")
      render :text => res.to_json
    when "post"
      id=ActiveRecord::Base.connection.select_value("
      BEGIN
        DECLARE @id INT;
        SET @id=idgenerator('renew_plan_goods');
        INSERT INTO dbo.renew_plan_goods(
          id,
          goods,
          renew_plan,
          measure,
          goods_volume,
          trucknum,
          donevol,
          isxls)
        VALUES(
          @id,
          #{params[:goods].to_i},
          #{params[:master_id].to_i},
          1078,
          (SELECT ISNULL(g.height * g.length * g.width / 1000000000, 0)
          FROM goods g
          WHERE g.id=#{params[:goods].to_i}),
          #{(params[:trucknum].to_i!=0) ? params[:trucknum].to_i : 'null'},
          #{(params[:donevol].to_i!=0)? params[:donevol].to_i : 'null'},
          1);
        SELECT @id;
      END")
      
      render :text => {"success" => true, "id" => id}.to_json
    when "put"
      ActiveRecord::Base.connection.execute("
      UPDATE renew_plan_goods
      SET
        goods=#{params[:goods].to_i},
        donevol=#{(params[:donevol].to_i!=0)? params[:donevol].to_i : 'null'},
        trucknum = #{(params[:trucknum].to_i!=0)? params[:trucknum].to_i : 'null'}
      WHERE id=#{params[:id].to_i} AND isxls=1")
      
      render :text => {"success" => true, "id" => params[:id]}.to_json
    when "delete"
      ActiveRecord::Base.connection.execute("
      DELETE FROM renew_plan_goods
      WHERE id=#{params[:id].to_i} AND isxls=1")
      
      render :text => {"success" => true}.to_json
    end
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