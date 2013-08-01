# encoding: utf-8
class ClothingSizeController < ApplicationSimpleErrorController
  def index
  end
  
  def test
	root = EmpDept.find(:first, :conditions => "parent_id is null")
	logger.info root.to_node.to_json
  end
  
  def clothing_size
	  case request.method.to_s
		when "get"
			dept_id=(params[:dept_id].nil?)?(-1):(params[:dept_id]=='')?(0):params[:dept_id].to_i
			res=ActiveRecord::Base.connection.select_all("
			select
				person.person_id id,
				person.shortened,
				ed1.name dept,
				(select name from emp_pos where emp_pos.id=emp_rel.pos_id) pos,
				get_extra_value('person_size_shoulders',person.person_id) size_shoulders,
				get_extra_value('person_size_hips',person.person_id) size_hips
			from
				person
				join emp_rel on person.person_id=emp_rel.person_id
				join emp_dept ed1 on ed1.id=emp_rel.dept_id
				join emp_dept ed2 on charindex(ed2.path,ed1.path)>0
			where
				today() between emp_rel.ddateb and isnull(emp_rel.ddatee,'9999-01-01') and
				ed2.id=#{dept_id}
			order by
				ed1.path, emp_rel.magnitude desc, shortened ")
			 render :text => res.to_json
		when "put"
			ActiveRecord::Base.connection.update("
				call _extra.setvalue(#{params[:id].to_i},'person_size_shoulders',#{ActiveRecord::Base.connection.quote(params[:size_shoulders])}); ")
				ActiveRecord::Base.connection.update("
				call _extra.setvalue(#{params[:id].to_i},'person_size_hips',#{ActiveRecord::Base.connection.quote(params[:size_hips])}); ")
			    render :text => {"success" => true, "id" => params[:id]}.to_json
    end
	
  end

  def dept
    case request.method.to_s
      when "get"
        root = EmpDept.find(:first, :conditions => "parent_id is null")
		tree = root.to_node.to_json
		logger.info tree
        #result = {"success" => true, "children" => tree}
      
        #render :text => result.to_json
		render :text => tree
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