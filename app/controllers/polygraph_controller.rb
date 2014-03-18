# encoding: utf-8
require 'RMagick'

include Magick
class PolygraphController < ApplicationSimpleErrorController
  def index
  end

  def get_candidates
    method=request.method.to_s
    case method
    when "get"
      rs = ActiveRecord::Base.connection.select_all("select * from renew_web.candidates order by ddate desc")
      render :text => rs.to_json
    when "put"
      id =params[:id].to_i
      ddate=(params[:ddate].nil? || params[:ddate].to_s=='')? 'null' :'\''+Time.parse(params[:ddate]).strftime('%F')+'\''
      birth_date=(params[:birth_date].nil? || params[:birth_date].to_s=='')? 'null' :'\''+Time.parse(params[:birth_date]).strftime('%F')+'\''
      lname=ActiveRecord::Base.connection.quote (params[:lname])
      fname=ActiveRecord::Base.connection.quote (params[:fname])
      mname=ActiveRecord::Base.connection.quote (params[:mname])

      emp_pos_id = (!params[:emp_pos_id].nil? && params[:emp_pos_id]!='null') ? params[:emp_pos_id].to_i: 'null';
      result_id= (!params[:result_id].nil? && params[:result_id]!='null') ? params[:result_id].to_i: 'null';
      zodiac_id = (!params[:zodiac_id].nil? && params[:zodiac_id]!='null') ? params[:zodiac_id].to_i: 'null';
      marital_status= (!params[:marital_status].nil? && params[:marital_status]!='null') ? params[:marital_status].to_i: 'null';

      children_count = params[:children_count].to_i

      ActiveRecord::Base.connection.update ("update renew_web.candidates set ddate=#{ddate},lname=#{lname},fname=#{fname},mname=#{mname},emp_pos_id=#{emp_pos_id},birth_date=#{birth_date},zodiac_id=#{zodiac_id},marital_status=#{marital_status},children_count=#{children_count},result_id=#{result_id} WHERE id=#{id}")
      render :text => {"success" => true}.to_json
    when "delete"
      id =params[:id].to_i
      ActiveRecord::Base.connection.delete ("DELETE FROM renew_web.candidates WHERE id=#{id}")
      render :text => {"success" => true}.to_json
    when "post"
      ddate=(params[:ddate].nil? || params[:ddate].to_s=='')? 'null' :'\''+Time.parse(params[:ddate]).strftime('%F')+'\''
      lname=ActiveRecord::Base.connection.quote (params[:lname])
      fname=ActiveRecord::Base.connection.quote (params[:fname])
      mname=ActiveRecord::Base.connection.quote (params[:mname])

      emp_pos_id = (!params[:emp_pos_id].nil? && params[:emp_pos_id]!='null') ? params[:emp_pos_id].to_i: 'null';
      result_id= (!params[:result_id].nil? && params[:result_id]!='null') ? params[:result_id].to_i: 'null';
      zodiac_id = (!params[:zodiac_id].nil? && params[:zodiac_id]!='null') ? params[:zodiac_id].to_i: 'null';
      marital_status= (!params[:marital_status].nil? && params[:marital_status]!='null') ? params[:marital_status].to_i: 'null';

      birth_date=(params[:birth_date].nil? || params[:birth_date].to_s=='')? 'null' :'\''+Time.parse(params[:birth_date]).strftime('%F')+'\''
      children_count = params[:children_count].to_i

      id = ActiveRecord::Base.connection.select_value("
      BEGIN
        DECLARE @id INT;
        SET @id=idgenerator('renew_web.candidates');

        INSERT INTO renew_web.candidates (id,  ddate,     lname,    fname,    mname,    emp_pos_id,    birth_date,    zodiac_id,    marital_status,    children_count,    result_id)
        VALUES                         ( @id, #{ddate}, #{lname}, #{fname}, #{mname}, #{emp_pos_id}, #{birth_date}, #{zodiac_id}, #{marital_status}, #{children_count}, #{result_id});

        SELECT @id;
      END")

      render :text=>{"id" => id, "success"=>true}.to_json

    end
  end

  def get_zodiacs
    rs = ActiveRecord::Base.connection.select_all("select id, name from renew_web.zodiacs")
    render :text => rs.to_json
  end

  def get_candidate_results
    rs = ActiveRecord::Base.connection.select_all("select id, name from renew_web.candidate_results")
    render :text => rs.to_json
  end

  def get_emp_pos
    rs = ActiveRecord::Base.connection.select_all("select id, name from dbo.emp_pos")
    render :text => rs.to_json
  end

  def get_experienxes
    method=request.method.to_s
    case method
    when "get"
      master_id =params[:master_id].to_i
      rs = ActiveRecord::Base.connection.select_all("select * from renew_web.experienxes where candidate_id = #{master_id}")
      render :text => rs.to_json
    when "post"
      master_id =params[:master_id].to_i
      organization=ActiveRecord::Base.connection.quote (params[:organization])
      position=ActiveRecord::Base.connection.quote (params[:position])
      ddateb=(params[:ddateb].nil? || params[:ddateb].to_s=='')? 'null' :'\''+Time.parse(params[:ddateb]).strftime('%F')+'\''
      ddatee=(params[:ddatee].nil? || params[:ddatee].to_s=='')? 'null' :'\''+Time.parse(params[:ddatee]).strftime('%F')+'\''
      id = ActiveRecord::Base.connection.select_value("
      BEGIN
        DECLARE @id INT;
        SET @id=idgenerator('renew_web.experienxes');

        INSERT INTO renew_web.experienxes (id, candidate_id,  ddateb,       organization,    position,     ddatee)
        VALUES                          ( @id, #{master_id}, #{ddateb}, #{organization}, #{position}, #{ddatee});

        SELECT @id;
      END")

      render :text=>{"id" => id, "success"=>true}.to_json

    when "put"
      id =params[:id].to_i
      organization=ActiveRecord::Base.connection.quote (params[:organization])
      position=ActiveRecord::Base.connection.quote (params[:position])
      ddateb=(params[:ddateb].nil? || params[:ddateb].to_s=='')? 'null' :'\''+Time.parse(params[:ddateb]).strftime('%F')+'\''
      ddatee=(params[:ddatee].nil? || params[:ddatee].to_s=='')? 'null' :'\''+Time.parse(params[:ddatee]).strftime('%F')+'\''
      ActiveRecord::Base.connection.update ("update renew_web.experienxes set organization=#{organization}, position=#{position}, ddateb=#{ddateb},ddatee=#{ddatee} WHERE id=#{id}")
      render :text => {"success" => true}.to_json
    when "delete"
      id =params[:id].to_i
      ActiveRecord::Base.connection.delete ("DELETE FROM renew_web.experienxes WHERE id=#{id}")
      render :text => {"success" => true}.to_json

    end

  end

  def get_candidate_answers
    method=request.method.to_s
    case method
    when "get"
      master_id =params[:master_id].to_i
      rs = ActiveRecord::Base.connection.select_all("select * from renew_web.candidate_answers where candidate_id = #{master_id}")
      render :text => rs.to_json
    when "post"
      master_id =params[:master_id].to_i
      name=ActiveRecord::Base.connection.quote (params[:name])
      question_id = (!params[:question_id].nil? && params[:question_id]!='null') ? params[:question_id].to_i: 'null';

      id = ActiveRecord::Base.connection.select_value("
      BEGIN
        DECLARE @id INT;
        SET @id=idgenerator('renew_web.candidate_answers');

        INSERT INTO renew_web.candidate_answers (  id, candidate_id,   question_id,      name)
        VALUES                          		( @id, #{master_id},  #{question_id},  #{name});

		   SELECT @id;
      END")

      render :text=>{"id" => id, "success"=>true}.to_json
    when "put"
      id =params[:id].to_i
      master_id =params[:master_id].to_i
      name=ActiveRecord::Base.connection.quote (params[:name])
      question_id = (!params[:question_id].nil? && params[:question_id]!='null') ? params[:question_id].to_i: 'null';
      ActiveRecord::Base.connection.update ("update renew_web.candidate_answers set name=#{name}, question_id=#{question_id} WHERE id=#{id}")
      render :text => {"success" => true}.to_json

    when "delete"
      id =params[:id].to_i
      ActiveRecord::Base.connection.delete ("DELETE FROM renew_web.candidate_answers WHERE id=#{id}")
      render :text => {"success" => true}.to_json
    end
  end

  def get_candidate_questions
    rs = ActiveRecord::Base.connection.select_all("select id, name from renew_web.candidate_questions")
    render :text => rs.to_json
  end

  def get_persons
    method=request.method.to_s
    case method
    when "get"
      rs = PolygraphPerson.find (:all)
      render :text => rs.to_json
    when "post"
      res = PolygraphPerson.new(
      :result_id=>params[:result_id],
      :person=>params[:person],
      :marital_status=>params[:marital_status],
      :children_count=>params[:children_count],
      :ddate=>params[:ddate],
      :info=>params[:info]
      )
      res.id = ActiveRecord::Base.connection.select_value("SELECT idgenerator('renew_web.polygraph_person')")
      res.save
      render :text => {"success" => true, "id" => res.id}.to_json
    when "put"
      id = params[:id].to_i
      PolygraphPerson.update(
      id,
      {
        :result_id=>params[:result_id],
        :person=>params[:person],
        :marital_status=>params[:marital_status],
        :children_count=>params[:children_count],
        :ddate=>params[:ddate],
        :info=>params[:info]
      })
      render :text => {"success" => true}.to_json
    when "delete"
      id =params[:id].to_i
      PolygraphPerson.delete (id);
      rs = RuzaPicture.connection.delete("delete FROM person_pictures WHERE id = #{id}")
      render :text => {"success" => true}.to_json
    end
  end

  def get_allperson
    rs = ActiveRecord::Base.connection.select_all("select distinct p.person_id id, p.shortened name  from    dbo.person p join dbo.emp_rel er on p.person_id=er.person_id and today() between er.ddateb and isnull(er.ddatee,'9999-01-01') order by name")
    render :text => rs.to_json
  end

  def get_polygraph_person_result
    rs = PolygraphPersonResult.find (:all)
    render :text => rs.to_json
  end

  def get_person_answers
    method=request.method.to_s
    case method
    when "get"
      rs = PolygraphPersonAnswer.find_all_by_polygraph_person_id (params[:master_id])
      render :text => rs.to_json
    when "post"
      res = PolygraphPersonAnswer.new(
      :question_id=>params[:question_id],
      :name=>params[:name],
      :polygraph_person_id=>params[:master_id]

      )
      res.id = ActiveRecord::Base.connection.select_value("SELECT idgenerator('renew_web.polygraph_person_answers')")
      res.save
      render :text => {"success" => true, "id" => res.id}.to_json
    when "delete"
      id =params[:id].to_i
      PolygraphPersonAnswer.delete (id);
      render :text => {"success" => true}.to_json

    end
  end

  def get_person_questions
    rs = PolygraphPersonQuestion.find (:all)
    render :text => rs.to_json

  end

  def upload_person_picture
    begin
      uploaded = StringIO.new
      File.copy_stream(params[:image], uploaded)
      full_image = Image.from_blob(uploaded.string)[0]
      small_image = full_image.resize_to_fit(256)

      #������� ������ ����� ���� ��� ���� � ����
      rs = RuzaPicture.connection.delete("delete FROM person_pictures WHERE id = #{params[:master_id].to_i}")

      picture = PersonPicture.new()
      picture.id = params[:master_id].to_i
      picture.name = params[:image].original_filename
      picture.content_type = params[:image].content_type
      picture.full_picture = full_image.to_blob
      picture.small_picture = small_image.to_blob
      picture.width = full_image.columns
      picture.height = full_image.rows
      picture.small_width = small_image.columns
      picture.small_height = small_image.rows
      if picture.save
        begin
          render text: {"success" => true}.to_json
        rescue => t
        picture.destroy
        end
      else
        render text: ({"success" => false, "errors" => ERB::Util.json_escape(picture.errors.inspect)}).to_json, status: 500
      end
    rescue => t
      render text: ({"success" => false, "errors" => ERB::Util.json_escape(t.to_s), "params" => params[:image].original_filename}).to_json, status: 500
    end
  end

  def get_pictures

    rs = RuzaPicture.connection.select_all("
      SELECT
       id,
       name,
       small_width,
       small_height
      FROM
       person_pictures
      WHERE
       id = #{params[:master_id].to_i}")

    render :text => rs.to_json

  end

  def get_picture_small
    picture = PersonPicture.find(params[:id])

    response.headers['Content-Type'] = picture.content_type
    response.headers['Content-Disposition'] = 'inline'
    render text: picture.small_picture
  end

  def get_picture_full
    picture = PersonPicture.find(params[:id])

    response.headers['Content-Type'] = picture.content_type
    response.headers['Content-Disposition'] = 'inline'
    render text: picture.full_picture
  end

end