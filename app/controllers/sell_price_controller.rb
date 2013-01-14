# encoding: utf-8

class SellPriceController < ApplicationSimpleErrorController
  def sell_prices
    ddateb=nullify params[:ddateb]
    ddatee=nullify params[:ddatee]
    
    ddateb=Time.parse(ddateb).strftime('%F') if ddateb!='null'
    ddatee=(ddatee!="null")?(Time.parse(ddatee).strftime('%F')):('01-01-9999')

    partner_id=params[:partner_id].to_i

    case request.method.to_s
    when "get"
      begin

        sell_prices_list = ActiveRecord::Base.connection.select_all("
        SELECT
          sp.id,
          t.goods_id goods_id,
          t.goods_name goods_name,
          t.lggroup_id lggroup_id,
          t.price*(1-ISNULL(sp.discount, 0)) price,
          #{partner_id} partner_id,
          CONVERT(varchar(10), sp.ddateb, 120) ddateb,
          IF sp.ddatee='9999-01-01' THEN NULL ELSE ddatee END IF ddatee,
          sp.discount*100 discount,
          t.price bprice,
          sp.sell_reason_id
        FROM
          sell_price sp
          JOIN (
          SELECT
            price,
            goods_id,
            goods_name,
            lggroup_id
          FROM
            renew_web.get_price_data(#{partner_id}, TODAY())) t ON sp.goods=t.goods_id
        WHERE
          dbo.isect('#{ddateb}', '#{ddatee}', sp.ddateb, sp.ddatee)>0
          AND
          sp.partner= #{partner_id} 
          AND
          sp.price IS NULL")

        render :text => sell_prices_list.to_json
      end
    when "post"
      begin
        ActiveRecord::Base.connection.execute(
        "exec renew_web.sell_price_ins(
        #{partner_id},
        #{params[:goods_id].to_i},
        '#{ddateb}',
        '#{ddatee}',
        #{params[:discount].to_f/100.0},
        #{nullify params[:sell_reason_id]})")

        render :text => "[]"
      end
    when "put"
      begin
        ActiveRecord::Base.connection.execute(
        "exec renew_web.sell_price_ins(
        #{partner_id},
        #{params[:goods_id].to_i},
        '#{ddateb}',
        '#{ddatee}',
        #{params[:discount].to_f/100.0},
        #{nullify params[:sell_reason_id]})")

        render :text => "[]"
      end
    when "delete"
      begin
        ActiveRecord::Base.connection.execute("
        BEGIN
          DECLARE @partner_id int;
          DECLARE @ddateb   datetime;
          DECLARE @ddatee   datetime;
          DECLARE @goods_id int;
          
          SELECT partner, ddateb, ddatee, goods
          INTO @partner_id, @ddateb, @ddatee, @goods_id
          FROM sell_price
          WHERE id=#{params[:id].to_i}
          
          DELETE FROM sell_price
          WHERE
            partner=@partner_id AND
            ddateb=@ddateb AND
            ddatee=@ddatee AND
            goods IN (
            SELECT
              id
            FROM
              goods
            WHERE
              ISNULL(semigoods,id) IN
              (SELECT
                ISNULL(g.semigoods, g.id)
              FROM
                goods g
              WHERE
                g.id=@goods_id))
              AND
              discount>0
        END")
        render :text => {"success" => true}.to_json
      end
    end
  end

  def get_goods_prices
    partner_id=params[:partner_id].to_i

    goods_prices=ActiveRecord::Base.connection.select_all("
    SELECT
      t.goods_id,
      t.goods_name,
      t.lggroup_id,
      t.catmanager_name,
      t.price,
      ddateb,
      ddatee
    FROM
      renew_web.get_price_data(#{partner_id}, TODAY()) t
      JOIN (SELECT
        bp_goods.goods goods_id,
        bp_goods.ddateb,
        bp_goods.ddatee
      FROM
        dbo.bp_groups bp_g
        JOIN dbo.v_bprog_goods bp_goods ON bp_g.id=bp_goods.bp_group
      WHERE
        bp_g.name='Желтый ценник') t1 ON t.goods_id=t1.goods_id")

    render :json => goods_prices.to_json
  end

  def get_lggroups
    partner_id=params[:partner_id].to_i

    lggroups=ActiveRecord::Base.connection.select_all("
    select distinct
      l.id,
      l.name
    from  
      partner_plist ppl 
      join pricelist_prices pp on pp.list=ppl.plist
      join goods g on g.id=pp.goods
      join goods_lggroup() lg ON lg.id=g.id 
      join lggroup l on l.id = lg.lggroup
      join v_bprog_goods bp_goods on bp_goods.goods = g.id
      join bp_groups bp_g ON bp_g.id = bp_goods.bp_group
    where
      bp_g.name='Желтый ценник' and
      (exists
        (select
          1
        from
          plset_ggroup, goods_groups_tree ggt 
        where
          plset_ggroup.plset=ppl.plset
          and
          plset_ggroup.g_group=ggt.parent and ggt.id=g.g_group
        )
        or not exists (select 1 from plset_ggroup where plset_ggroup.plset=ppl.plset)
      )
      and
      ppl.partner = #{partner_id}
      and pp.ddate = today()
    order by
      2")
    render :json => lggroups.to_json
  end

  def get_discount_reasons
    discount_reasons=ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      name
    FROM
      sell_reason")
    render :json => discount_reasons.to_json
  end

  def get_partners
    partners=ActiveRecord::Base.connection.select_all("
    SELECT DISTINCT TOP #{params[:limit].to_i}
      p.id,
      p.name+' ['+pg.name+']' name
    FROM
      partners p
      JOIN partners_groups_tree pgt ON pgt.id=p.parent
      JOIN partners_groups pg on pg.id = p.parent
      JOIN buyers b ON b.partner=p.id
      JOIN buyers_sp_sets bsps ON bsps.client=b.id
      JOIN sp_types sp_tp ON sp_tp.id=bsps.sp_tp
      JOIN sp_values sp_v ON sp_v.id=bsps.spv_id
    WHERE
      p.name LIKE '%'+'#{ActiveRecord::Base.connection.quote_string(params[:query])}'+'%'
      AND
      pg.name NOT LIKE 'Архив_%'
      AND
      pgt.parent IN (
      SELECT
          partner_group_id
        FROM
          renew_web.renew_users ru
          JOIN renew_web.renew_user_sell_price rusp ON rusp.renew_user_id=ru.id
        WHERE
          ru.name='#{session[:user_id]}')
      AND
      sp_tp.name='Канал'
      AND
      (sp_v.name='Розница ключ.' OR sp_v.name='Сеть локальная')
    ORDER BY
      name")
    
    render :json => partners.to_json
  end

  def index
  end

  private

  def nullify val
    val=(val.nil? || val=="")? "null" : val
  end

end
