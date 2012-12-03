# encoding: utf-8
class AutoTransportController < ApplicationSimpleErrorController
  def index
  end

  def nomenclature_groups
    case request.method.to_s
      when "get"
        res=ActiveRecord::Base.connection.select_all("SELECT id, name, at_ggtype FROM renew_web.at_ggroup")
        
        render :text => res.to_json
      when "post"
        id=ActiveRecord::Base.connection.select_value("
        BEGIN
          DECLARE @id INT;
          SET @id=idgenerator('renew_web.at_ggroup');
          INSERT INTO renew_web.at_ggroup(id, name, at_ggtype)
          VALUES(@id, #{ActiveRecord::Base.connection.quote(params[:name])}, #{params[:at_ggtype].to_i});
          
          SELECT @id;
        END")
        
        render :text => {"success" => true, "id" => id}.to_json
      when "put"
        ActiveRecord::Base.connection.update("
        UPDATE renew_web.at_ggroup SET
          name=#{ActiveRecord::Base.connection.quote(params[:name])},
          at_ggtype=#{params[:at_ggtype].to_i}
        WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true, "id" => params[:id]}.to_json
      when "delete"
        ActiveRecord::Base.connection.delete("DELETE FROM renew_web.at_ggroup WHERE id=#{params[:id].to_i}")
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
          (select cnt from at_remains where at_goods = renew_web.at_goods.id) cnt
        FROM
          renew_web.at_goods
        WHERE
          at_ggroup=#{params[:group_id].to_i} OR 0=#{params[:group_id].to_i}")
        render :text => res.to_json
      when "post"
        id=ActiveRecord::Base.connection.select_value("
        BEGIN
          DECLARE @id INT;
          SET @id=idgenerator('renew_web.at_goods');
          INSERT INTO renew_web.at_goods(id, name, at_ggroup, measure)
          VALUES(@id, #{ActiveRecord::Base.connection.quote(params[:name])}, #{params[:at_ggroup].to_i}, #{params[:measure].to_i});
          
          SELECT @id;
        END")
        
        render :text => {"success" => true, "id" => id}.to_json
      when "put"
        ActiveRecord::Base.connection.update("
        UPDATE renew_web.at_goods SET
          name=#{ActiveRecord::Base.connection.quote(params[:name])},
          at_ggroup=#{params[:at_ggroup].to_i},
          measure=#{params[:measure].to_i}
        WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true, "id" => params[:id]}.to_json
      when "delete"
        ActiveRecord::Base.connection.delete("DELETE FROM renew_web.at_goods WHERE id=#{params[:id].to_i}")
        
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
          ig.vol*ig.price sum
        FROM
          renew_web.at_income i
          LEFT JOIN renew_web.at_incgoods ig
        WHERE
          i.ddate >= '#{Time.parse(params[:ddateb]).strftime('%F %T')}'
          AND
          i.ddate < DATEADD(day, 1, '#{Time.parse(params[:ddatee]).strftime('%F %T')}')")
        render :text => res.to_json
      when "post"
        id=ActiveRecord::Base.connection.select_value("
        BEGIN
          DECLARE @id INT;
          SET @id=idgenerator('renew_web.at_income');
          INSERT INTO renew_web.at_income(id, ddate, type)
          VALUES(@id, '#{Time.parse(params[:ddate]).strftime('%F %T')}', #{params[:type].to_i});
          
          SELECT @id;
        END")
        
        render :text => {"success" => true, "id" => id}.to_json
      when "put"
        ActiveRecord::Base.connection.update("
        UPDATE renew_web.at_income SET
          ddate='#{Time.parse(params[:ddate]).strftime('%F %T')}',
          type=#{params[:type].to_i}
        WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true, "id" => params[:id]}.to_json
      when "delete"
        ActiveRecord::Base.connection.delete("DELETE FROM renew_web.at_income WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true}.to_json
    end
  end
  
  def inc_goods
    case request.method.to_s
      when "get"
        res=ActiveRecord::Base.connection.select_all("
        SELECT
          id,
          (SELECT id FROM renew_web.at_ggroup gg WHERE gg.id=ig.at_goods) at_ggroup, 
          at_goods,
          (SELECT id FROM renew_web.at_goods g WHERE g.id=ig.at_goods) measure,
          vol,
          price
        FROM
          renew_web.at_incgoods ig
        WHERE
          at_income=#{params[:at_income].to_i}")
        render :text => res.to_json
      when "post"
        id=ActiveRecord::Base.connection.select_value("
        BEGIN
          DECLARE @id INT;
          SET @id=idgenerator('renew_web.at_incgoods');
          INSERT INTO renew_web.at_incgoods(id, at_income, at_goods, vol, price)
          VALUES(
            @id,
            #{params[:at_income].to_i},
            #{params[:at_goods].to_i},
            #{params[:vol].to_i},
            #{params[:price].to_f});
          
          SELECT @id;
        END")
        
        render :text => {"success" => true, "id" => id}.to_json
      when "put"
        ActiveRecord::Base.connection.update("
        UPDATE renew_web.at_incgoods SET
          at_goods= #{params[:at_goods].to_i},
          vol= #{params[:vol].to_i},
          price= #{params[:price].to_i}
        WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true, "id" => params[:id]}.to_json
      when "delete"
        ActiveRecord::Base.connection.delete("DELETE FROM renew_web.at_incgoods WHERE id=#{params[:id].to_i}")
        
        render :text => {"success" => true}.to_json
    end
  end
  
  def get_measures
    measures=Measure.find(:all,
    :select => "id, name",
    :conditions => "name IN ('литр', 'килограмм', 'грамм', 'штука', 'комплект')",
    :order => "name")
    render :text => measures.to_json
  end
  
  def get_nomenclature_group_types
    res=ActiveRecord::Base.connection.select_all("SELECT id, name FROM renew_web.at_ggtype")
    render :text => res.to_json
  end

end