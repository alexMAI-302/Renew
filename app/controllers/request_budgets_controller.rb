# encoding: utf-8
class RequestBudgetsController < ApplicationSimpleErrorController
  def index
  end

  def request_budgets
    method=request.method.to_s
    case method
    when "get"


  	

	  personf = params[:personf].to_i
	  deptf = params[:deptf].to_i
	  cmf = params[:cmf].to_i

	  rs = ActiveRecord::Base.connection.select_all ("select * from renew_web.get_request_budgets ( #{personf},#{deptf},#{cmf})")
      render :text => rs.to_json
    when "post"
      ddate=(params[:ddate].nil? || params[:ddate].to_s=='')? 'null' :'\''+Time.parse(params[:ddate]).strftime('%F')+'\''
      tmside = (!params[:tmside].nil? && params[:tmside]!='null') ? params[:tmside].to_i: 'null'
      channel_NRC = (!params[:channel_NRC].nil? && params[:channel_NRC]!='null') ? params[:channel_NRC].to_i: 'null'
      person = (!params[:person].nil? && params[:person]!='null') ? params[:person].to_i: 'null'
      partner= (!params[:partner].nil? && params[:partner]!='null') ? params[:partner].to_i: 'null'
      comm = ActiveRecord::Base.connection.quote (params[:comm])
      summ = (!params[:summ].nil? && params[:summ]!='null') ? params[:summ].to_f: 'null'
      id = ActiveRecord::Base.connection.select_value("
      BEGIN
        DECLARE @id INT;
        SET @id=idgenerator('renew_web.request_budgets');

        INSERT INTO renew_web.request_budgets
        (
            id,
            tmside,
            channel_NRC,
            partner,
            ddate,
            person,
            summ,
            comm
        )
        VALUES
        (
            @id,
            #{tmside},
            #{channel_NRC},
            #{partner},
            #{ddate},
            #{person},
            #{summ},
            #{comm}
       );

        SELECT @id;
      END")

      render :text=>{"id" => id, "success"=>true}.to_json

    when "put"
      ddate=(params[:ddate].nil? || params[:ddate].to_s=='')? 'null' :'\''+Time.parse(params[:ddate]).strftime('%F')+'\''
      tmside = (!params[:tmside].nil? && params[:tmside]!='null') ? params[:tmside].to_i: 'null'
      channel_NRC = (!params[:channel_NRC].nil? && params[:channel_NRC]!='null') ? params[:channel_NRC].to_i: 'null'
      person = (!params[:person].nil? && params[:person]!='null') ? params[:person].to_i: 'null'
      partner= (!params[:partner].nil? && params[:partner]!='null') ? params[:partner].to_i: 'null'
      comm = ActiveRecord::Base.connection.quote (params[:comm])
      summ = (!params[:summ].nil? && params[:summ]!='null') ? params[:summ].to_f: 'null'
      id =params[:id].to_i
      ActiveRecord::Base.connection.update ("update renew_web.request_budgets
      set
      tmside=#{tmside},
      channel_NRC=#{channel_NRC},
      partner=#{partner},
      ddate=#{ddate},
      person=#{person},
      summ=#{summ},
      comm=#{comm}

      WHERE id=#{id}")
      render :text => {"success" => true}.to_json
    when "delete"
      id =params[:id].to_i
      ActiveRecord::Base.connection.delete ("DELETE FROM renew_web.request_budgets WHERE id=#{id}")
      render :text => {"success" => true}.to_json

    end
  end

  def get_person
    rs = ActiveRecord::Base.connection.select_all("select distinct p.person_id id, p.shortened name  from    dbo.person p join dbo.emp_rel er on p.person_id=er.person_id and today() between er.ddateb and isnull(er.ddatee,'9999-01-01') order by name")
    render :text => rs.to_json
  end

  def get_current_person
    user_id = session[:user_id]
    rs = ActiveRecord::Base.connection.select_all("select top 1 person.person_id id  from agents join person  on person.person_id = agents.person join dbo.emp_rel er on person.person_id=er.person_id and today() between er.ddateb and isnull(er.ddatee,'9999-01-01') where loginname+'@unact.ru' = '#{user_id}'")
    render :text => rs.to_json
  end

  def get_partners
    rs=ActiveRecord::Base.connection.select_all("select id, name from renew_web.get_request_budgets_partners ()")

    render :text => rs.to_json
  end

  def get_channel_nrs
    rs = ActiveRecord::Base.connection.select_all("
      SELECT sp_values.id,
         sp_values.name
    FROM sp_values, sp_types
   WHERE sp_values.sp_tp = sp_types.id
   AND sp_types.id=19

   ORDER BY sp_values.name ASC

    ")
    render :text => rs.to_json
  end

  def get_tmside
    rs = ActiveRecord::Base.connection.select_all("
      SELECT tmside.id,
         tmside.name
    FROM tmside
    order by
    tmside.name ASC

    ")
    render :text => rs.to_json
end	
	
	
def get_dept
    rs = ActiveRecord::Base.connection.select_all("select id, name from dbo.emp_dept order by path")
    render :text => rs.to_json
 end
 
 	def get_catmanager
    rs = ActiveRecord::Base.connection.select_all("select id, name from dbo.catmanager order by name")
    render :text => rs.to_json
  end

end