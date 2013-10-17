# encoding: utf-8
class IncrequestReasonController < ApplicationSimpleErrorController
  def index
  end

  def increquest_reason
    method=request.method.to_s
    case method
    when "get"
      rs = ActiveRecord::Base.connection.select_all("select * from dbo.increquest_reason order by name")
      render :text => rs.to_json
    when "put"
      name=ActiveRecord::Base.connection.quote (params[:name])
      id =params[:id].to_i
      responsibility_area_id=nullify_int params[:responsibility_area_id]
      ActiveRecord::Base.connection.update ("update dbo.increquest_reason set name=#{name}, responsibility_area_id=#{responsibility_area_id} WHERE id=#{id}")
      render :text => {"success" => true}.to_json
    when "delete"
      id =params[:id].to_i
      ActiveRecord::Base.connection.delete ("DELETE FROM dbo.increquest_reason WHERE id=#{id}")
      render :text => {"success" => true}.to_json
    when "post"
      name=ActiveRecord::Base.connection.quote (params[:name])
      responsibility_area_id=nullify_int params[:responsibility_area_id]

      id = ActiveRecord::Base.connection.select_value("
      BEGIN
        DECLARE @id INT;
        SET @id=idgenerator('dbo.increquest_reason');

        INSERT INTO dbo.increquest_reason (id,    name,     responsibility_area_id)
        VALUES                           (@id,  #{name},  #{responsibility_area_id});
        SELECT @id;
      END")

      render :text=>{"id" => id, "success"=>true}.to_json

    end
  end

  def get_responsibility_areas
    rs = ActiveRecord::Base.connection.select_all("select id, name from dbo.responsibility_areas")
    render :text => rs.to_json
  end

end