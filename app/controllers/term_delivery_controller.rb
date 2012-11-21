# encoding: utf-8
class TermDeliveryController < ApplicationSimpleErrorController

  def get_zone_types
    zone_types = ActiveRecord::Base.connection.select_all( "select id, name from sp_values where sp_tp=1626" )
    
    render :text => zone_types.to_json
  end
  
  def get_routes
    session[:ddate]=params[:ddate]
	only_with_errors=( params[:only_with_errors]=="true")?(1):(0)
	only_in_route=( params[:only_in_route]=="true")?(1):(0)
	
	
    routes_list = ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      name,
      points,
      points_inroute,
      delivery,
      delivery_status4,
      IF points_inroute>0 THEN 1 ELSE 0 END IF include_in_auto_route
    FROM
      spp.Terminal_Delivery_get_zones(
        '#{(!session[:user_id].nil?)?(session[:user_id]):("guest")}',
        7,
        #{params[:zone_type_id].to_i},
        '#{Time.parse(params[:ddate]).strftime('%F')}',
        #{only_with_errors},
        #{only_in_route})")
    
	logger.info(params[:only_with_errors].to_i)
    render :text => routes_list.to_json
  end
  
  def get_terminals
    terminals_list = ActiveRecord::Base.connection.select_all("
    SELECT
      terminalid id,
      real_terminalid info_terminal_id,
      name,
      subdealer_name,
      subdealer subdealer_id,
      zone zone_id,
      zone_name,
      src_system src_system_id,
      src_system_name,
      LastConnectTime last_connect_time,
      LastConnectTime_class last_connect_time_class,
      LastPaymentTime last_payment_time,
      LastPaymentTime_class last_payment_time_class,
      SignalLevel signal_level,
      summ,
      cnt,
      inroute include_in_route,
      ErrorText error_text,
      IncassReason incass_reason,
      terminal_break terminal_break_id,
      techinfo techinfo,
      branch_name,
      servstatus serv_status,
      penaltystatus penalty_status,
      modified should_include_in_route,
      row_class
    FROM
      spp.Terminal_Delivery(
        '#{(!session[:user_id].nil?)?(session[:user_id]):("guest")}',
        7,
        #{params[:zone_type_id].to_i},
        '#{Time.parse(params[:ddate]).strftime('%F')}',
        #{params[:only_with_errors].to_i},
        #{params[:only_in_route].to_i},
        40000,
        350,
        #{params[:zone_id].to_i})")
    
    render :text => terminals_list.to_json
  end
  
  def get_config
    config = ActiveRecord::Base.connection.select_one("
  		SELECT
  		ISNULL((SELECT
          1
        FROM
          renew_web.renew_users_groups rusgs
        WHERE
          rusgs.renew_user_id=ru.id AND rusgs.renew_user_group_id=13), 0) change_terminals,
  			ISNULL((SELECT
  				1
  			FROM
  				renew_web.renew_users_groups rusgs
  			WHERE
  				rusgs.renew_user_id=ru.id AND rusgs.renew_user_group_id=18), 0) change_is,
  			ISNULL((SELECT
  				1
  			FROM
  				renew_web.renew_users_groups rusgs
  			WHERE
  				rusgs.renew_user_id=ru.id AND rusgs.renew_user_group_id=21), 0) change_techinfo
  		FROM
		  	renew_web.renew_users ru
  		WHERE
	   		ru.name='#{(!session[:user_id].nil?)?(session[:user_id]):("guest")}'");
  
  	render :text => config.to_json
  end
  
  def get_terminal_breaks
    breaks = ActiveRecord::Base.connection.select_all("
  	SELECT
  		id,
  		break_name name
  	FROM
  		terminal_break
  	ORDER BY
  		name")
  	
  	render :text => breaks.to_json
  end
  
  def route_print
    if params[:zone] 
      zone=params[:zone].to_i
      @date=params[:ddate]
      @zone_name=ActiveRecord::Base.connection.select_value(" SELECT name from pps_zone where id = #{zone} ")
      @rep =ActiveRecord::Base.connection.select_all("    
      SELECT
        pps_zone.name pps_zone_name,
        osmp_terminal.code          terminal_code,
        contract_placement.name     address,
        isnull(convert(varchar,osmp_routepoint.sstack_to),'')   seal_to,
        isnull(convert(varchar,osmp_routepoint.sstack_plan),'') seal_plan,
        isnull(osmp_routepoint.info,'')        info,
        pps_terminal.terminalid     terminalid
      FROM  pps_zone
        join agents on pps_zone.name=agents.name
        join delivery on agents.id=delivery.securer
        join osmp_route on osmp_route.delivery=delivery.id
        join osmp_routepoint on osmp_routepoint.route=osmp_route.id
        join osmp_placement on osmp_placement.id = osmp_routepoint.placement
        join contract_placement on contract_placement.id = osmp_placement.cplacement
        left outer join (
          osmp_increquest
          join osmp_reqtype on osmp_reqtype.id = osmp_increquest.type
          ) on osmp_increquest.id = osmp_routepoint.reqid
        join osmp_terminal on osmp_terminal.id = osmp_placement.terminal
        join pps_terminal on pps_terminal.id = osmp_terminal.pps_terminal
      WHERE
        pps_zone.id = #{zone}  and delivery.ddate>='#{@date}' and delivery.ddate<dateadd(day,1,'#{@date}')
        AND ISNULL(osmp_reqtype.code, '') <> 'service'
      ORDER BY
        osmp_routepoint.id")
    end
    render :layout => false
  end
  
  def route_export
    headers['Content-Type'] = "application/vnd.ms-excel"
    
    s = "
    SELECT
      *
    FROM
      spp.Terminal_Delivery(
        '#{(!session[:user_id].nil?)?(session[:user_id]):("guest")}',
        7,
        #{params[:zone_type_id].to_i},
        '#{Time.parse(params[:ddate]).strftime('%F')}',
        #{params[:only_with_errors].to_i},
        #{params[:only_in_route].to_i},
        40000,
        350,
        #{params[:zone].to_i})"
    
    @rst_term = ActiveRecord::Base.connection.select_all(s)                               
    
    render :layout => false
  end

  def index
  	render :layout => "application_ocean"
  end
  
  def make_delivery_auto
    zones_to_include=ActiveSupport::JSON.decode(request.body.gets)
    items=zones_to_include.to_xml(:root => "zones")
    s = "call spp.Terminal_Delivery_make_delivery_auto(
        '#{(!session[:user_id].nil?)?(session[:user_id]):("guest")}',
        7,
        #{params[:zone_type_id].to_i},
        '#{Time.parse(params[:ddate]).strftime('%F')}',
        #{params[:only_with_errors].to_i},
        #{params[:only_in_route].to_i},
        40000,
        350,
        #{ActiveRecord::Base.connection.quote(items)})"
    r = ActiveRecord::Base.connection.execute(s)
    
    render :text => 'ok'
  end
  
  def save_terminal
		terminals_to_save=ActiveSupport::JSON.decode(request.body.gets)
    items=terminals_to_save.to_xml(:root => "terminals")
		s = "call spp.Terminal_DeliverySave(#{ActiveRecord::Base.connection.quote(items)},'#{Time.parse(session[:ddate]).strftime('%F')}')"
		r = ActiveRecord::Base.connection.execute(s)
		
		render :text => 'ok'
  end
  
  def status4_save
    access=ActiveRecord::Base.connection.select_value("
      SELECT
        ISNULL((SELECT
          1
        FROM
          renew_web.renew_users_groups rusgs
        WHERE
          rusgs.renew_user_id=ru.id AND rusgs.renew_user_group_id=18), 0) change_is
      FROM
        renew_web.renew_users ru
      WHERE
        ru.name='#{(!session[:user_id].nil?)?(session[:user_id]):("guest")}'").to_i
    if access==1
      routes_to_save=ActiveSupport::JSON.decode(request.body.gets)
  		routes_to_save.each do |route|
  			id=route["id"].to_i;
  			
  			r = Delivery.find(id)
  			r.status4 = route["delivery_status4"]
  			r.save
  		end
		end
			
		render :text => "ok"
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
end