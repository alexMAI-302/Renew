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
        
        render :text => id.to_json
      when "put"
        ActiveRecord::Base.connection.update("
        UPDATE renew_web.at_ggroup SET
          name=#{ActiveRecord::Base.connection.quote(params[:name])},
          at_ggtype=#{params[:at_ggtype].to_i}
        WHERE id=#{params[:id].to_i}")
        
        render :text => params[:id]
      when "delete"
        ActiveRecord::Base.connection.delete("DELETE FROM renew_web.at_ggroup WHERE id=#{params[:id].to_i}")
        render :text => ""
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
          at_ggroup=#{params[:group_id].to_i}")
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
        
        render :text => id.to_json
      when "put"
        ActiveRecord::Base.connection.update("
        UPDATE renew_web.at_goods SET
          name=#{ActiveRecord::Base.connection.quote(params[:name])},
          at_ggroup=#{params[:at_ggroup].to_i},
          measure=#{params[:measure].to_i}
        WHERE id=#{params[:id].to_i}")
        
        render :text => params[:id]
      when "delete"
        ActiveRecord::Base.connection.delete("DELETE FROM renew_web.at_goods WHERE id=#{params[:id].to_i}")
        
        render :text => ""
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