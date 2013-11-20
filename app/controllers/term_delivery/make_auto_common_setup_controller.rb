# encoding: utf-8

class TermDelivery::MakeAutoCommonSetupController < ApplicationSimpleErrorController
  def index
  end

  def get_zones
    zone_type=params[:zone_type].to_i

    res=ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      name
    FROM
      pps_zone
    ORDER BY
      name")

	  render :text => res.to_json
  end

  def terminals
    case request.method.to_s
    when "get"
      zone_id=(params[:zone_id].nil? || params[:zone_id]=='')? -1 : params[:zone_id].to_i
      str=ActiveRecord::Base.connection.quote(params[:str].to_s.strip)

      if zone_id!=-1 || str!="''"
        res=ActiveRecord::Base.connection.select_all("call dbo.ask_make_auto_common_setup( #{zone_id}, #{str})")
      else
      res=[]
      end
		
      render :text => res.to_json
    when "put"
      id=params[:id].to_i
      monday=params[:monday]? 1 : 0
      tuesday=params[:tuesday]? 1 : 0
      wednesday=params[:wednesday]? 1 : 0
      thursday=params[:thursday]? 1 : 0
      friday=params[:friday]? 1 : 0
      saturday=params[:saturday]? 1 : 0
      sunday=params[:sunday]? 1 : 0
      exclude=params[:exclude]? 1 : 0
      info = (params[:info].nil? || params[:info].to_s=='') ? nil : params[:info].to_s.strip
 
      if (monday+tuesday+wednesday+thursday+friday+saturday+sunday+exclude>=1)
        ActiveRecord::Base.connection.execute("
          INSERT INTO pps_terminal_skip_days(
            terminal_id,
            week_days,
            exclude
          )
          ON EXISTING UPDATE
          VALUES(
            #{id},
            '#{sunday}#{monday}#{tuesday}#{wednesday}#{thursday}#{friday}#{saturday}',
            #{exclude}
          )")
      else
        ActiveRecord::Base.connection.execute("
          DELETE FROM pps_terminal_skip_days WHERE terminal_id=#{id}")
      end
	  PpsTerminal.update(id, {:info => info})
	  
	  time_begin=ActiveRecord::Base.connection.quote(params[:monday_time_begin]? params[:monday_time_begin][11..15]: "")
	  time_end=  ActiveRecord::Base.connection.quote(params[:monday_time_end]  ? params[:monday_time_end][11..15]: "")
	  ActiveRecord::Base.connection.execute("call dbo.prc_pps_terminal_worktime_save(#{id},2,#{time_begin},#{time_end})")
	 
	  time_begin=ActiveRecord::Base.connection.quote(params[:tuesday_time_begin]? params[:tuesday_time_begin][11..15]: "")
	  time_end=  ActiveRecord::Base.connection.quote(params[:tuesday_time_end]  ? params[:tuesday_time_end][11..15]: "")
	  ActiveRecord::Base.connection.execute("call dbo.prc_pps_terminal_worktime_save(#{id},3,#{time_begin},#{time_end})")
	  
	  time_begin=ActiveRecord::Base.connection.quote(params[:wednesday_time_begin]? params[:wednesday_time_begin][11..15]: "")
	  time_end=  ActiveRecord::Base.connection.quote(params[:wednesday_time_end]  ? params[:wednesday_time_end][11..15]: "")
	  ActiveRecord::Base.connection.execute("call dbo.prc_pps_terminal_worktime_save(#{id},4,#{time_begin},#{time_end})")
	  
	  time_begin=ActiveRecord::Base.connection.quote(params[:thursday_time_begin]? params[:thursday_time_begin][11..15]: "")
	  time_end=  ActiveRecord::Base.connection.quote(params[:thursday_time_end]  ? params[:thursday_time_end][11..15]: "")
	  ActiveRecord::Base.connection.execute("call dbo.prc_pps_terminal_worktime_save(#{id},5,#{time_begin},#{time_end})")
	  
	  time_begin=ActiveRecord::Base.connection.quote(params[:friday_time_begin]? params[:friday_time_begin][11..15]: "")
	  time_end=  ActiveRecord::Base.connection.quote(params[:friday_time_end]  ? params[:friday_time_end][11..15]: "")
	  ActiveRecord::Base.connection.execute("call dbo.prc_pps_terminal_worktime_save(#{id},6,#{time_begin},#{time_end})")
	  
	  time_begin=ActiveRecord::Base.connection.quote(params[:saturday_time_begin]? params[:saturday_time_begin][11..15]: "")
	  time_end=  ActiveRecord::Base.connection.quote(params[:saturday_time_end]  ? params[:saturday_time_end][11..15]: "")
	  ActiveRecord::Base.connection.execute("call dbo.prc_pps_terminal_worktime_save(#{id},7,#{time_begin},#{time_end})")
	  
	  time_begin=ActiveRecord::Base.connection.quote(params[:sunday_time_begin]? params[:sunday_time_begin][11..15]: "")
	  time_end=  ActiveRecord::Base.connection.quote(params[:sunday_time_end]  ? params[:sunday_time_end][11..15]: "")
	  ActiveRecord::Base.connection.execute("call dbo.prc_pps_terminal_worktime_save(#{id},1,#{time_begin},#{time_end})")
	      

      render :text => {"success" => true}.to_json
    end
  end
end