# encoding: utf-8
class ScheduleRequestController < ApplicationController

	def index
		@displayname=session[:user_displayname]
		@mail=session[:user_mail]
	end		

	def sending
		@comments=params[:comments].to_s
		if @comments==""
			flash[:notice] ="Причина должна быть указана"
			redirect_to :action => "index"
		else
			flash[:notice] =nil
			ddateb_year=params[:ddateb][:year].to_i
			ddateb_month=params[:ddateb][:month].to_i
			ddateb_day=params[:ddateb][:day].to_i
			ddateb_hour=params[:ddateb_hour][:hour].to_i
			ddateb_minute=params[:ddateb_minute][:minute].to_i
			ddateb=DateTime.civil(ddateb_year, ddateb_month, ddateb_day, ddateb_hour, ddateb_minute, 0, 0)

			ddatee_year=params[:ddatee][:year].to_i
			ddatee_month=params[:ddatee][:month].to_i
			ddatee_day=params[:ddatee][:day].to_i
			ddatee_hour=params[:ddatee_hour][:hour].to_i
			ddatee_minute=params[:ddatee_minute][:minute].to_i
			ddatee=DateTime.civil(ddatee_year, ddatee_month, ddatee_day, ddatee_hour, ddatee_minute, 0, 0)

			schedule_request=Schedule_Request.new
			schedule_request.id=ActiveRecord::Base.connection.select_value("select idgenerator('schedule_request')")
			schedule_request.person=ActiveRecord::Base.connection.select_value("select top 1 person_id from person where lname+' '+fname='#{session[:user_displayname]}' ")
			schedule_request.status=0
			schedule_request.ddateb=ddateb
			schedule_request.ddatee=ddatee
			schedule_request.comments=@comments
			schedule_request.save

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
