# encoding: utf-8

class SimPlaceController < ApplicationController

	def sim_places
		ddateb=(nullify params[:ddateb])[0..9]
		ddatee=(params[:ddatee] && params[:ddatee]!="" && params[:ddatee]!="null")?(params[:ddatee][0..9]):('01-01-9999')
		
		case request.method.to_s
			when "get"
				sim_place = ActiveRecord::Base.connection.select_all("select id, simka_id, CONVERT(varchar(10),ddate, 120) ddate, person_id
										      from sim_place where ddate between '#{ddateb}' and '#{ddatee}'")
				render :text => sim_place.to_json
			when "post"
				ActiveRecord::Base.connection.execute("insert into sim_place(id, simka_id, ddate, person_id)
				select idgenerator('sim_place'), '#{params[:simka_id]}', '#{params[:ddate][0..9]}', #{params[:person_id]}")
				render :text => "[]"
			when "put"
				ActiveRecord::Base.connection.execute("update
								          sim_place
								       set
									  simka_id = #{params[:simka_id]},
									  ddate = '#{params[:ddate][0..9]}',
									  person_id = #{params[:person_id]}
								       where id = #{params[:id]}")
				render :text => "[]"
			when "delete"
				ActiveRecord::Base.connection.execute("delete sim_place
								      where id = #{params[:id]}")
				render :text => "[]"
		end
	end

	def simka
		
	end

        def simka_do
		ddateb=(nullify params[:ddateb])[0..9]
		ddatee=(params[:ddatee] && params[:ddatee]!="" && params[:ddatee]!="null")?(params[:ddatee][0..9]):('01-01-9999')
		
		case request.method.to_s
			when "get"
				simka_list = ActiveRecord::Base.connection.select_all("select id, msidn, icc, CONVERT(varchar(10),ddate, 120) ddate,
										      unlim, CONVERT(varchar(10),date_unlim, 120) date_unlim, isblocked
										      from simka where ddate between '#{ddateb}' and '#{ddatee}'")
				render :text => simka_list.to_json
			when "post"															       
				iud_simka 1
			when "put"
				iud_simka 2
			when "delete"
				iud_simka 3
		end
	end
	
	def get_person
		emp_person=ActiveRecord::Base.connection.select_all("
		select p.person_id id, p.shortened name from  emp_rel r join person  p on p.person_id = r.person_id 
		where r.dept_id in (select id from emp_dept where (parent_id = 93 or id in (335,351,405,410,466))) and 
			(r.ddatee is null or today() between ddateb and ddatee)
		order by 2")
		render :json => emp_person.to_json
	end

	def get_simka
		simka=ActiveRecord::Base.connection.select_all("select id, msidn, icc, CONVERT(varchar(10),ddate, 120) ddate,
		unlim, CONVERT(varchar(10),date_unlim, 120) date_unlim, isblocked
		from simka order by 2")
		render :json => simka.to_json
	end
	
	def index
	end
	
	private
	def nullify val
		val=(val.nil? || val=="")? "null" : val
	end
	
	def nullstr val
		val=(val.nil? || val=="")? "null" : "'#{val}'"
	end

	def nulldate val
		val=(val.nil? || val=="")? "null" : "'#{val[0..9]}'"
	end
	
	def iud_simka iud
		params.delete("_dc") 
		a = params["_json"]?params["_json"]:[params]		
		ssql = "begin
				declare @errmsg varchar(255);
				call iud_simka( #{iud},  '#{a.to_xml}', @errmsg);
						select @errmsg errmsg;
			end;"
		
		errmsg = ActiveRecord::Base.connection.select_value(ssql)
		if errmsg.size > 0
			render :text => '{"success":false, "message":"' + errmsg + '"}'
		else
			render :text => '[]'
		end

	end
end
