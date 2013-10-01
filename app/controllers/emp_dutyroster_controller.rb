# encoding: utf-8
class EmpDutyrosterController < ApplicationSimpleErrorController
  def index
  end

  def emp_dutyroster
    method=request.method.to_s
    case method
    when "get"
      ddatebf=Time.parse(params[:ddatebf]).strftime('%F')
      ddateef=Time.parse(params[:ddateef]).strftime('%F')
      rs = ActiveRecord::Base.connection.select_all("select * from dbo.emp_dutyroster where not (ddatee < '#{ddatebf}'  or ddateb > '#{ddateef}') order by ddateb")
      render :text => rs.to_json
    when "put"
      ddateb=(params[:ddateb].nil? || params[:ddateb].to_s=='')?('1900-01-01'):Time.parse(params[:ddateb]).strftime('%F')
      ddatee=(params[:ddatee].nil? || params[:ddatee].to_s=='')?('1900-01-01'):Time.parse(params[:ddatee]).strftime('%F')
      dutytype=params[:dutytype].to_i
      person_id=params[:person_id].to_i
      id =params[:id].to_i
      ActiveRecord::Base.connection.update ("update dbo.emp_dutyroster set dutytype=#{dutytype}, person_id=#{person_id}, ddateb='#{ddateb}', ddatee='#{ddatee}' WHERE id=#{id}")
      render :text => {"success" => true}.to_json
    when "delete"
      id =params[:id].to_i
      ActiveRecord::Base.connection.delete ("DELETE FROM dbo.emp_dutyroster WHERE id=#{id}")
      render :text => {"success" => true}.to_json
    when "post"
      ddateb=(params[:ddateb].nil? || params[:ddateb].to_s=='')?('1900-01-01'):Time.parse(params[:ddateb]).strftime('%F')
      ddatee=(params[:ddatee].nil? || params[:ddatee].to_s=='')?('1900-01-01'):Time.parse(params[:ddatee]).strftime('%F')
      dutytype=params[:dutytype].to_i
      person_id=params[:person_id].to_i

      id = ActiveRecord::Base.connection.select_value("
      BEGIN
        DECLARE @id INT;
        SET @id=idgenerator('dbo.emp_dutyroster');

        INSERT INTO dbo.emp_dutyroster (id,     ddateb,      ddatee,    person_id,    dutytype)
        VALUES                         (@id, '#{ddateb}', '#{ddatee}',#{person_id}, #{dutytype});
        SELECT @id;
      END")

      render :text=>{"id" => id, "success"=>true}.to_json

    end
  end

  def get_person
    rs = ActiveRecord::Base.connection.select_all("select p.person_id id, p.shortened name  from    dbo.person p join dbo.emp_rel er on p.person_id=er.person_id and today() between er.ddateb and isnull(er.ddatee,'9999-01-01')")
    render :text => rs.to_json
  end

  def get_emp_dutytype
    rs = ActiveRecord::Base.connection.select_all("select id, name from dbo.emp_dutytype")
    render :text => rs.to_json
  end

end