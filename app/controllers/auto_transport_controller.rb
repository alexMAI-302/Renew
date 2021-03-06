# encoding: utf-8
class AutoTransportController < ApplicationSimpleErrorController
  def index
  end
  
  def get_flat_nomenclature_groups
    res=ActiveRecord::Base.connection.select_all("
      SELECT
        gg.id,
        gg.name
      FROM
        dbo.at_ggroup gg
      ORDER BY
        gg.name")
    
      render :text => res.to_json
  end

  def nomenclature_groups
    case request.method.to_s
      when "get"
        tree = []
        indexes = {}
        i=0
        data=ActiveRecord::Base.connection.select_all("
        SELECT
          gg.id,
          gg.name,
          ggt.id parent_id,
          ggt.name parent_name
        FROM
          dbo.at_ggroup gg
          JOIN dbo.at_ggtype ggt ON gg.at_ggtype=ggt.id
        ORDER BY
          ggt.name,
          gg.name")
          
        data.each do |d|
          if indexes[d["parent_id"]].nil?
            tree << {
              "id" => d["parent_id"],
              "name" => d["parent_name"],
              "children" => [],
              "expanded" => true
            }
            indexes[d["parent_id"]] = i
            i=i+1
          end
          tree[indexes[d["parent_id"]]]["children"]<< {
            "id" => d["id"],
            "name" => d["name"],
            "leaf" => true,
            "parentId" => d["parent_id"]
          }
        end
        logger.info tree
        result = {"success" => true, "children" => tree}
      
        render :text => result.to_json
      when "post"
        at_ggtype=ActiveSupport::JSON.decode(request.body.gets)["parentId"].to_i
        id=ActiveRecord::Base.connection.select_value("
        BEGIN
          DECLARE @id INT;
          SET @id=idgenerator('at_ggroup');
          INSERT INTO dbo.at_ggroup(id, name, at_ggtype)
          VALUES(@id, #{ActiveRecord::Base.connection.quote(params[:name])}, #{at_ggtype});
          
          SELECT @id;
        END")
        
        render :text => {"success" => true, "id" => id}.to_json
      when "put"
        at_ggtype=ActiveSupport::JSON.decode(request.body.gets)["parentId"].to_i
        ActiveRecord::Base.connection.update("
        UPDATE dbo.at_ggroup SET
          name=#{ActiveRecord::Base.connection.quote(params[:name])},
          at_ggtype=#{at_ggtype}
        WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true, "id" => params[:id]}.to_json
      when "delete"
        ActiveRecord::Base.connection.delete("DELETE FROM dbo.at_ggroup WHERE id=#{params[:id].to_i}")
        render :text => {"success" => true}.to_json
    end
  end
  
  def nomenclature
    case request.method.to_s
      when "get"
        res=ActiveRecord::Base.connection.select_all("
        SELECT
          id,
          name,
          at_ggroup,
          measure,
          (select cnt from at_remains where at_goods = dbo.at_goods.id) cnt
        FROM
          dbo.at_goods
        WHERE
          at_ggroup=#{params[:master_id].to_i} OR -1=#{params[:master_id].to_i}
        ORDER BY
          name")
        render :text => res.to_json
      when "post"
        id=ActiveRecord::Base.connection.select_value("
        BEGIN
          DECLARE @id INT;
          SET @id=idgenerator('at_goods');
          INSERT INTO dbo.at_goods(id, name, at_ggroup, measure)
          VALUES(@id, #{ActiveRecord::Base.connection.quote(params[:name])}, #{params[:at_ggroup].to_i}, #{params[:measure].to_i});
          
          SELECT @id;
        END")
        
        render :text => {"success" => true, "id" => id}.to_json
      when "put"
        ActiveRecord::Base.connection.update("
        UPDATE dbo.at_goods SET
          name=#{ActiveRecord::Base.connection.quote(params[:name])},
          at_ggroup=#{params[:at_ggroup].to_i},
          measure=#{params[:measure].to_i}
        WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true, "id" => params[:id]}.to_json
      when "delete"
        ActiveRecord::Base.connection.delete("DELETE FROM dbo.at_goods WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true}.to_json
    end
  end
  
  def income
    case request.method.to_s
      when "get"
        res=ActiveRecord::Base.connection.select_all("
        SELECT
          i.id,
          i.ddate,
          i.type,
          (SELECT SUM(ig.vol*ig.price) FROM dbo.at_incgoods ig WHERE ig.at_income=i.id) sum,
          i.at_seller
        FROM
          dbo.at_income i
        WHERE
          i.ddate >= '#{Time.parse(params[:ddateb]).strftime('%F %T')}'
          AND
          i.ddate < DATEADD(day, 1, '#{Time.parse(params[:ddatee]).strftime('%F %T')}')")
        render :text => res.to_json
      when "post"
        id=ActiveRecord::Base.connection.select_value("
        BEGIN
          DECLARE @id INT;
          SET @id=idgenerator('at_income');
          INSERT INTO dbo.at_income(id, ddate, type, at_seller)
          VALUES(
            @id,
            '#{Time.parse(params[:ddate]).strftime('%F %T')}',
            #{params[:type].to_i},
            #{(!params[:at_seller].nil? && params[:at_seller]!='null') ? params[:at_seller].to_i: 'null'});
          
          SELECT @id;
        END")
        
        render :text => {"success" => true, "id" => id}.to_json
      when "put"
        ActiveRecord::Base.connection.update("
        UPDATE dbo.at_income SET
          ddate='#{Time.parse(params[:ddate]).strftime('%F %T')}',
          type=#{params[:type].to_i},
          at_seller = #{(!params[:at_seller].nil? && params[:at_seller]!='null') ? params[:at_seller].to_i: 'null'}
        WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true, "id" => params[:id]}.to_json
      when "delete"
        ActiveRecord::Base.connection.delete("DELETE FROM dbo.at_income WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true}.to_json
    end
  end
  
  def inc_goods
    case request.method.to_s
      when "get"
        res=ActiveRecord::Base.connection.select_all("
        SELECT
          ig.id,
          g.at_ggroup, 
          ig.at_goods,
          g.measure,
          ig.vol,
          ig.price
        FROM
          dbo.at_incgoods ig
          LEFT JOIN dbo.at_goods g ON g.id=ig.at_goods
        WHERE
          ig.at_income=#{params[:master_id].to_i}")
        render :text => res.to_json
      when "post"
        id=ActiveRecord::Base.connection.select_value("
        BEGIN
          DECLARE @id INT;
          SET @id=idgenerator('at_incgoods');
          INSERT INTO dbo.at_incgoods(id, at_income, at_goods, vol, price)
          VALUES(
            @id,
            #{params[:master_id].to_i},
            #{params[:at_goods].to_i},
            #{params[:vol].to_f},
            #{params[:price].to_f});
          
          SELECT @id;
        END")
        
        render :text => {"success" => true, "id" => id, "sum" => params[:sum]}.to_json
      when "put"
        ActiveRecord::Base.connection.update("
        UPDATE dbo.at_incgoods SET
          at_goods= #{params[:at_goods].to_i},
          vol= #{params[:vol].to_f},
          price= #{params[:price].to_i}
        WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true, "id" => params[:id], "sum" => params[:sum]}.to_json
      when "delete"
        ActiveRecord::Base.connection.delete("DELETE FROM dbo.at_incgoods WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true}.to_json
    end
  end
  
  def recept
    case request.method.to_s
      when "get"
        res=ActiveRecord::Base.connection.select_all("
        SELECT
          r.id,
          r.ddate,
          r.pa_card truck_id,
          (SELECT DISTINCT
            pa_card.serial + ' ' + ISNULL(truck_type.name, goods.short_name, '')
          FROM
            pa_card
            join goods on pa_card.goods = goods.id
            join goods_groups_tree ggt on ggt.id = goods.g_group
            left outer join truck on truck.pa_card = pa_card.id
            left outer join truck_type on truck_type.id = truck.type
          WHERE
            pa_card.id = r.pa_card) truck_name
        FROM
          dbo.at_recept r
        WHERE
          r.ddate >= '#{Time.parse(params[:ddateb]).strftime('%F %T')}'
          AND
          r.ddate < DATEADD(day, 1, '#{Time.parse(params[:ddatee]).strftime('%F %T')}')")
        render :text => res.to_json
      when "post"
        id=ActiveRecord::Base.connection.select_value("
        BEGIN
          DECLARE @id INT;
          SET @id=idgenerator('at_recept');
          INSERT INTO dbo.at_recept(id, ddate, pa_card)
          VALUES(@id, '#{Time.parse(params[:ddate]).strftime('%F %T')}', #{(!params[:truck_id].nil? && params[:truck_id]!='null') ? params[:truck_id].to_i: 'null'});
          
          SELECT @id;
        END")
        
        render :text => {"success" => true, "id" => id}.to_json
      when "put"
        ActiveRecord::Base.connection.update("
        UPDATE dbo.at_recept SET
          ddate='#{Time.parse(params[:ddate]).strftime('%F %T')}',
          pa_card=#{(!params[:truck_id].nil? && params[:truck_id]!='null') ? params[:truck_id].to_i: 'null'}
        WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true, "id" => params[:id]}.to_json
      when "delete"
        ActiveRecord::Base.connection.delete("DELETE FROM dbo.at_recept WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true}.to_json
    end
  end
  
  def rec_goods
    case request.method.to_s
      when "get"
        res=ActiveRecord::Base.connection.select_all("
        SELECT
          rg.id,
          g.at_ggroup, 
          rg.at_goods,
          g.measure,
          rg.vol
        FROM
          dbo.at_recgoods rg
          LEFT JOIN dbo.at_goods g ON g.id=rg.at_goods
        WHERE
          at_recept=#{params[:master_id].to_i}")
        render :text => res.to_json
      when "post"
        id=ActiveRecord::Base.connection.select_value("
        BEGIN
          DECLARE @id INT;
          SET @id=idgenerator('at_recgoods');
          INSERT INTO dbo.at_recgoods(id, at_recept, at_goods, vol)
          VALUES(
            @id,
            #{params[:master_id].to_i},
            #{params[:at_goods].to_i},
            #{params[:vol].to_f});
          
          SELECT @id;
        END")
        
        render :text => {"success" => true, "id" => id}.to_json
      when "put"
        ActiveRecord::Base.connection.update("
        UPDATE dbo.at_recgoods SET
          at_goods= #{params[:at_goods].to_i},
          vol= #{params[:vol].to_f}
        WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true, "id" => params[:id]}.to_json
      when "delete"
        ActiveRecord::Base.connection.delete("DELETE FROM dbo.at_recgoods WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true}.to_json
    end
  end
  
  def sellers
    case request.method.to_s
      when "get"
        res=ActiveRecord::Base.connection.select_all("
        SELECT
          id,
          name
        FROM
          dbo.at_seller
        ORDER BY
          name")
        render :text => res.to_json
      when "post"
        id=ActiveRecord::Base.connection.select_value("
        BEGIN
          DECLARE @id INT;
          SET @id=idgenerator('at_seller');
          INSERT INTO dbo.at_seller(id, name)
          VALUES(@id, #{ActiveRecord::Base.connection.quote(params[:name])});
          
          SELECT @id;
        END")
        
        render :text => {"success" => true, "id" => id}.to_json
      when "put"
        ActiveRecord::Base.connection.update("
        UPDATE dbo.at_seller SET
          name=#{ActiveRecord::Base.connection.quote(params[:name])}
        WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true, "id" => params[:id]}.to_json
      when "delete"
        ActiveRecord::Base.connection.delete("DELETE FROM dbo.at_seller WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true}.to_json
    end
  end
  
  def get_measures
    measures=Measure.find(:all,
    :select => "id, name",
    :conditions => "EXISTS(SELECT * FROM extra e JOIN etype et ON e.etype=et.id WHERE et.code='usedinautotransport' AND e.record_id=measures.id)",
    :order => "name")
    render :text => measures.to_json
  end
  
  def get_nomenclature_group_types
    res=ActiveRecord::Base.connection.select_all("SELECT id, name FROM dbo.at_ggtype")
    render :text => res.to_json
  end
  
  def get_trucks
    res=ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      name + ' ' + ISNULL(model, '') name
    FROM
      dbo.at_truck
    ORDER BY
      name, model")
    render :text => res.to_json
  end

end