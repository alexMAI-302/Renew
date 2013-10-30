# encoding: utf-8
class DelordDelMiscController < ApplicationSimpleErrorController
  def index
  end

  def delord_del_misc
    method=request.method.to_s
    case method
    when "get"
      rs = ActiveRecord::Base.connection.select_all("select * from dbo.delord_del_misc order by name")
      render :text => rs.to_json
    when "put"
      name=ActiveRecord::Base.connection.quote (params[:name])
      id =params[:id].to_i
      responsibility_area_id=nullify_int params[:responsibility_area_id]
      
      used_for_delivery=params[:used_for_delivery]? 1 : 0
      
      ActiveRecord::Base.connection.update ("update dbo.delord_del_misc set name=#{name}, responsibility_area_id=#{responsibility_area_id}, used_for_delivery=#{used_for_delivery} WHERE id=#{id}")
      render :text => {"success" => true}.to_json
    when "delete"
      id =params[:id].to_i
      ActiveRecord::Base.connection.delete ("DELETE FROM dbo.delord_del_misc WHERE id=#{id}")
      render :text => {"success" => true}.to_json
    when "post"
      name=ActiveRecord::Base.connection.quote (params[:name])
      responsibility_area_id=nullify_int params[:responsibility_area_id]
      used_for_delivery=params[:used_for_delivery]? 1 : 0

      id = ActiveRecord::Base.connection.select_value("
      BEGIN
        DECLARE @id INT;
        SET @id=idgenerator('dbo.delord_del_misc');

        INSERT INTO dbo.delord_del_misc (id,    name,     responsibility_area_id,  used_for_delivery)
        VALUES                         (@id, #{name}, #{responsibility_area_id}, #{used_for_delivery});
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