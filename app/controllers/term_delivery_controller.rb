# encoding: utf-8
class TermDeliveryController < ApplicationController
  layout "application_ocean", :except => "route_print"

  def index
	set_conditions	
	@longitude = 30
	@latitude = 50

	set_conditions
	
	@rst_sub = ActiveRecord::Base.connection.select_all("
	select top 20
		ps.subdealerid id,
		ps.name name,
		g.latitude latitude,
		g.longitude longitude,
		g.city city
	from
		pps_subdealers ps
		join subdealer_geoaddress sg on sg.subdealerid = ps.subdealerid 
		join geoaddress g on g.id = sg.geoaddressid 
	where
		ps.subdealerid in (select main_subdealerid from pps_terminal)" )
	@subdealers_list = @rst_sub.collect {|p| [ p["name"], p["id"] ] }
	@rst_sub.each do |p|
		if p["id"] == @subdealer
			@longitude = p["longitude"]
			@latitude = p["latitude"]
		end 
	end
	
	@rst_zone_type = ActiveRecord::Base.connection.select_all( "select id, name from sp_values where sp_tp=1626" )
	@zone_type_list = @rst_zone_type.collect {|p| [ p["name"], p["id"] ] }
	#@rst_zone_shift = ActiveRecord::Base.connection.select_all( "select id, name from pps_zone_shift where spv_id=#{@spv_id}" )
	#@zone_shift_list = @rst_zone_type.collect {|p| [ p["name"], p["id"] ] }
	@submit =ActiveRecord::Base.connection.select_value("
			select isnull(rusgs.renew_user_id,0)
			from renew_web.renew_users ru
			left outer join renew_web.renew_users_groups rusgs on rusgs.renew_user_id=ru.id and rusgs.renew_user_group_id=13
			where ru.name='#{(!session[:user_id].nil?)?(session[:user_id]):("guest")}' ");
			
	@save_IS =ActiveRecord::Base.connection.select_value("
			select isnull(rusgs.renew_user_id,0)
			from renew_web.renew_users ru
			left outer join renew_web.renew_users_groups rusgs on rusgs.renew_user_id=ru.id and rusgs.renew_user_group_id=18
			where ru.name='#{(!session[:user_id].nil?)?(session[:user_id]):("guest")}' ");

			
	@rst_term = ActiveRecord::Base.connection.select_all( "select * from spp.Terminal_Delivery('#{(!session[:user_id].nil?)?(session[:user_id]):("guest")}',#{@subdealer},#{@spv_id},'#{@ddate}')")														   
	#@rst_route2 = @rst_term.collect {|a| Hash["zone", a["zone"], "zone_name", a["zone_name"], "points", a["points"],"points_inroute", a["points_inroute"] ] }
	#@rst_route = @rst_term.collect {|a| a.to_s}
	#@rst_route = @rst_route.uniq
	#@rst_route = @rst_term.collect {|a| Hash.to_hash{a}}	
	#@rst_route = @rst_route2.uniq {|a| a["zone"]}
	zone=""
	@rst_route = []
	i=0
	@rst_term.each do |a|
			if zone!=a["zone"] then
				@rst_route<< Hash["zone", a["zone"], "zone_name", a["zone_name"], "points", a["points"],"points_inroute", a["points_inroute"],"delivery", a["delivery"],"delivery_status4", a["delivery_status4"], "delivery_status4_right", a["delivery_status4_right"]]				
			end
			zone=a["zone"]
	end
	#@zone_list =  ["Не выбрано",-666] 
	@zone_list = @rst_route.collect {|p| [ p["zone_name"], p["zone"] ] }
	@zone_list <<  ["Не выбрано",-666] 													   
	@break = ActiveRecord::Base.connection.select_all( "SELECT 	id, break_name name, break_penalty FROM terminal_break order by name")														   	
	@break_list = @break.collect {|p| [ p["name"], p["id"] ] }
	@break_list <<  ["Не выбрано",-666] 
  end
  
  	def save_terminal	
		begin 
			if params[:a]
				params[:a].delete_if do | key, value |
					 value[:termsave] == "0" || value[:zone_check] == "0" 
				end
				ar = []
				params[:a].each_pair do | key, value |
					value[:terminalid] = key
					ar << value
				end
				params[:a] = ar
				@ddate = session[:ddate]
				if @ddate== nil
					@ddate=Date.today().to_s
				end 
				@xml = params.to_xml(:only => [:a])
				s = "begin declare @r int;  @r = call spp.Terminal_DeliverySave('#{@xml}','#{@ddate}'); commit; select @r r; end;"
				r = ActiveRecord::Base.connection.select_value(s)
			end
		rescue ActiveRecord::StatementInvalid => exc
			flash[:notice] = "SQL Error: #{exc.message} "
		end
		redirect_to :action => "index"
  end
  
  
  	def status4_save
		begin 
			if params[:r]
				params[:r].each_pair do |id, value|
					@delivery=value[:delivery];
					if @delivery!=-666
						@status4=value[:delivery_status4];
						r = Delivery.find( @delivery )
						r.status4 = @status4
						r.save	
					end
				end
			end
		end
		redirect_to :action => "index"
  end
  
  
	def move_terminal
		begin 
			if params[:m][:term_to_move]
				@term_to_move=params[:m][:term_to_move];
				@to_zone=params[:m][:to_zone];
				@ddate = session[:ddate];
				s = "begin declare @r int;  @r = call spp.Terminal_DeliveryMove('#{@term_to_move}',#{@to_zone},'#{@ddate}'); commit; select @r r; end;"
				r = ActiveRecord::Base.connection.select_value(s)
			end
		end
		redirect_to :action => "index"
	end
  
  	
    def zone
		set_conditions	
		ActiveRecord::Base.include_root_in_json = false
		@rst_site = ActiveRecord::Base.connection.select_all( "
		select
			ps.subdealerid id,
			ps.name name
		from
			pps_subdealers ps
			join subdealer_geoaddress sg on sg.subdealerid = ps.subdealerid 
			join geoaddress g on g.id = sg.geoaddressid 
		where
			ps.subdealerid  in (select main_subdealerid from pps_terminal)" )
		@site_list = @rst_site.collect {|p| [ p["name"], p["id"] ] }

		@rst_spv = ActiveRecord::Base.connection.select_all( " select id, name from sp_values where sp_tp = 1626 " )
		@spv_list = @rst_spv.collect {|p| [ p["name"], p["id"] ] }

		@rst_route = ActiveRecord::Base.connection.select_all( " select id, name, points from pps_zone 
																 where subdealerid = #{@subdealer} and spv_id = #{@spv_id} order by name " )
		@route_list = []
		@route_index = 0
		@route_id = session[:route_id].to_i 
		@route_id = 0 if not @route_id
		@rst_route.each_with_index do |p,i| 
			@route_list << [ p["name"], i ]
			@route_index = i if @route_id == p["id"]
		end
		if @rst_route.size > 0
			@route_id = @rst_route[@route_index]["id"]
			@route_points = @rst_route[@route_index]["points"]
		else
			@route_id = 0
			@route_points = ""
		end 
		@route_json = @rst_route.to_json( :only => [ "id", "points", "name" ] )
		@rst_buyers = ActiveRecord::Base.connection.select_all( " select latitude, longitude
																from geoaddress_v  
																where  main_subdealerid = #{@subdealer} ") 																
		@rst_new = @rst_buyers.to_json( :only => [ "longitude", "latitude" ] ) 
		
	    @rst_zt  = ActiveRecord::Base.connection.select_all( "
		select
			t.zoneid zid,
			latitude,
			longitude,
			pname
		from
			pps_zone z join pps_zone_terminal t on t.zoneid = z.id
			join geoaddress_v g on g.ptid = t.pps_terminal
		where z.subdealerid = #{@subdealer} and z.spv_id = #{@spv_id} " )
																 
		@jzt = @rst_zt.to_json( ) 
	end
  
	def save_zone
		if params[:a]
			@route_id = params[:a][:routeid]
			session[:route_id] = @route_id 
			r = PpsZone.find( @route_id )
			r.points = params[:a][:points]
			r.save				
		end
		redirect_to :action => "zone"
	end
 
	def refresh_terminal
		zone=","
		subdealer=params[:post][:subdealer];
		params[:a].each_pair do |id, value|
			if value[:needsave] == "1"
				zone=zone+id.to_s+","
			end
		end
		@rst_term = ActiveRecord::Base.connection.select_all( "select* from spp.Terminal_Delivery(#{subdealer},'#{zone}')")
		render :partial => 'upd_terminal'

  	end
	
	def route_print
	@zone="11"
	print params.to_s
	#@zone="11"
	
	if params[:zone] 
		zone=params[:zone].to_i
		@date=params[:date]
		@zone_name=ActiveRecord::Base.connection.select_value("	SELECT name	from pps_zone where id = #{zone} ")
		@rep =ActiveRecord::Base.connection.select_all("		
		SELECT
			pps_zone.name	pps_zone_name,
			osmp_terminal.code          terminal_code,
			contract_placement.name     address,
			isnull(convert(varchar,osmp_routepoint.sstack_to),'')   seal_to,
			isnull(convert(varchar,osmp_routepoint.sstack_plan),'') seal_plan,
			isnull(osmp_routepoint.info,'')        info,
			pps_terminal.terminalid     terminalid
	FROM	pps_zone
			join agents on pps_zone.name=agents.name
			join delivery on agents.id=delivery.securer
			join osmp_route on osmp_route.delivery=delivery.id
			join osmp_routepoint on osmp_routepoint.route=osmp_route.id
				join osmp_placement on osmp_placement.id = osmp_routepoint.placement
				join contract_placement on contract_placement.id = osmp_placement.cplacement
				left outer join (osmp_increquest
									join osmp_reqtype on osmp_reqtype.id = osmp_increquest.type
								) on osmp_increquest.id = osmp_routepoint.reqid
				join osmp_terminal on osmp_terminal.id = osmp_placement.terminal
				join pps_terminal on pps_terminal.id = osmp_terminal.pps_terminal
	WHERE		pps_zone.id = #{zone}  and delivery.ddate>='#{@date}' and delivery.ddate<dateadd(day,1,'#{@date}')
	AND ISNULL(osmp_reqtype.code, '') <> 'service'
	ORDER BY
			osmp_routepoint.id		")
			
			
			
				
	end	
    
  end 
  
private

  def set_conditions
	@subdealer = 7
	@spv_id = 5626
	@shift = -1
	if params[:post] 
		@subdealer = params[:post][:subdealer].to_i
		session[:subdealer]  = @subdealer
		@spv_id = params[:post][:spv_id].to_i
		session[:spv_id]  = @spv_id
		@shift = params[:post][:shift].to_i
		session[:shift]  = @shift
	else
		@subdealer = session[:subdealer] if session[:subdealer]
		@spv_id = session[:spv_id] if session[:spv_id]
		@spv_id = session[:shift] if session[:shift]
	end
	@ddate =Date.today().to_s
	if params[:ddate]
		@ddate = params[:ddate]
		session[:ddate] = @ddate
	else
		session[:ddate] = @ddate
	end

 end

end
