# encoding: utf-8
class ScheduleRequestController < ApplicationController

	def index
	end
	
	def get_name
		displayname=session[:user_displayname]
		mail=session[:user_mail]	

		ddates = ActiveRecord::Base.connection.select_all(
"select top 1
		isnull(left(sch.beginning,5), '9:00') ddateb,
		isnull(left(convert(time, dateadd(hour, 9, sch.beginning)), 5), '18:00') ddatee
from
		person
			left outer join schedule_person sch on  sch.person = person.person_id
			                                    and dateadd(day, 1, today()) between sch.ddateb and sch.ddatee
where
		    person.lname+' '+person.fname = '#{session[:user_displayname]}'").first()
		
		render :text => {:displayname => displayname, :mail => mail, :ddateb => ddates['ddateb'], :ddatee => ddates['ddatee']}.to_json
	end

	def sending
		begin
			ddateb  =(params[:ddateb].nil?   || params[:ddateb].to_s=='')   ? nil : params[:ddateb].to_s
			ddatee  =(params[:ddatee].nil?   || params[:ddatee].to_s=='')   ? nil : params[:ddatee].to_s
			reason  =(params[:reason].nil?   || params[:reason].to_s=='')   ? nil : params[:reason].to_s
			comments=(params[:comments].nil? || params[:comments].to_s=='') ? nil : params[:comments].to_s
			ddatebF =(params[:ddatebF].nil?  || params[:ddatebF].to_s=='')  ? nil : params[:ddatebF].to_s
			ddateeF =(params[:ddateeF].nil?  || params[:ddateeF].to_s=='')  ? nil : params[:ddateeF].to_s	

			case reason
				when 'r0' then 
					reason_id = 0
				when 'r1' then
					reason_id = 1
					comments = "Работаю дома"
				when 'r2' then
					reason_id = 2
					comments = "Отпуск"
				else
					reason_id = nil
					comments = nil
			end
			
			schedule_request=Schedule_Request.new
			schedule_request.id=ActiveRecord::Base.connection.select_value("select idgenerator('schedule_request')")
			schedule_request.person=ActiveRecord::Base.connection.select_value("select top 1 person_id from person where lname+' '+fname='#{session[:user_displayname]}' ")
			schedule_request.status=0
			schedule_request.ddateb=ddateb
			schedule_request.ddatee=ddatee
			schedule_request.comments=comments
			schedule_request.ddateb_future=ddatebF
			schedule_request.ddatee_future=ddateeF
			schedule_request.reason=reason_id
			schedule_request.save
			
			render :text => {"success" => true,  "msg" => "Заявка принята"}.to_json

		rescue => t
			puts "Error!!! #{t}"
			render :text => {"success" => false, "msg" => "Error!!! #{t}"}.to_json
		end
	end
	
	
	def inout
		@ddatee=Date.today().to_s

		@ddateb=session[:ddateb]
		if params[:ddateb] && params[:ddateb]!=""
			@ddateb = params[:ddateb]
			session[:ddateb] = @ddateb
		end

		if params[:ddatee] && params[:ddatee]!=""
			@ddatee = params[:ddatee]
			session[:ddatee] = @ddatee
		end

		if (not @ddateb) || (@ddateb=="")
			@ddateb = Date.today().to_s
			session[:ddateb]=@ddateb
		end if

		@person=ActiveRecord::Base.connection.select_value("select top 1 person_id from person where lname+' '+fname='#{session[:user_displayname]}' ")
		@str_cond = " '#{@ddateb}', '#{@ddatee} ' "
		@rst_inout = ActiveRecord::Base.connection.select_all("
		select
		    id,
		    dir,
		    if dir=1 then 'Вход' else 'Выход' endif dir_name,
		    ddatetime
		from
		    entrance
		where
		    person_id=#{@person}
		    and
		    ddatetime between '#{@ddateb}' and dateadd(day,1,'#{@ddatee} ')
		order by
		    ddatetime");

	end

	def add_entrance
		ddate_year=params[:ddate][:year].to_i
		ddate_month=params[:ddate][:month].to_i
		ddate_day=params[:ddate][:day].to_i
		ddate_hour=params[:ddate_hour][:hour].to_i
		ddate_minute=params[:ddate_minute][:minute].to_i
		ddate=DateTime.civil(ddate_year, ddate_month, ddate_day, ddate_hour, ddate_minute, 0, 0)

		entrance=Entrance.new
		person=ActiveRecord::Base.connection.select_value("select top 1 person_id from person where lname+' '+fname='#{session[:user_displayname]}' ")
		entrance.person_id=person
		entrance.code=ActiveRecord::Base.connection.select_value("select '20'+right('0000'+convert(varchar,tabnum),4) from employee where person_id=#{person}")
		entrance.ddatetime=ddate
		entrance.dir=params[:dir][0]
		entrance.warstatus=0
		entrance.save
		redirect_to :action => "inout"
	end

	def edit_entrance
		ddate_year=params[:ddate][:year].to_i
		ddate_month=params[:ddate][:month].to_i
		ddate_day=params[:ddate][:day].to_i
		ddate_hour=params[:ddate_hour][:hour].to_i
		ddate_minute=params[:ddate_minute][:minute].to_i
		ddate=DateTime.civil(ddate_year, ddate_month, ddate_day, ddate_hour, ddate_minute, 0, 0)

		id=params[:id]
		entrance=Entrance.find(id)
		entrance.ddatetime=ddate
		entrance.dir=params[:dir][0]
		entrance.warstatus=0
		entrance.save
		redirect_to :action => "inout"

	end
end
