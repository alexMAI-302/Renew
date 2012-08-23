# encoding: utf-8
class ScheduleRequestActController < ApplicationPageErrorController
	def index
		@act=params[:act]
		@id=params[:id]
		@xid=params[:xid]
				
		if  @act=="" and @id=="" and @xid==""
		else
			if @act=="accept" 
				schedule_request=Schedule_Request.find(@id.to_i)
				@xid_bd=ActiveRecord::Base.connection.select_value("select convert(varchar,xid) from schedule_request where id=#{@id}").to_s
				if @xid_bd==@xid 
					schedule_request.status=1
					schedule_request.save
					@message="Заявка принята!"
				else	
					@message="Ошибочная ссылка!"
				end
			elsif  @act=="decline" 
				schedule_request=Schedule_Request.find(@id.to_i)
				@xid_bd=ActiveRecord::Base.connection.select_value("select convert(varchar,xid) from schedule_request where id=#{@id}").to_s
				if @xid_bd==@xid 
					@decline_reason=schedule_request.decline_reason
					session[:schedule_request_id]=@id
				else	
					@message="Ошибочная ссылка2"
				end
			elsif @act=="declined"
				@message="Заявка отклонена" 
			else
				@act=nil
			end	
		end		
	end		

	def decline
		@id=session[:schedule_request_id]
		schedule_request=Schedule_Request.find(@id.to_i)
		schedule_request.status=-1
		schedule_request.decline_reason=params[:decline_reason]
		schedule_request.save
		redirect_to :action => "index", :id=>@id, :act => "declined", :xid=> "1"
	end

end
