# encoding: utf-8

class TermDelivery::MakeAutoSetupController < ApplicationSimpleErrorController
  def index
  end
  
  def get_zones
    res=ActiveRecord::Base.connection.select_all("
    select id, name from pps_zone order by name")
    
    render :text => res.to_json
  end
  
  def get_periods
    res=ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      SUBSTR(CONVERT(varchar(10), ddateb, 103), 4, 7) name
    FROM
      period
    ORDER BY
      ddateb desc")
    
    render :text => res.to_json
  end
  
  def terminals
    case request.method.to_s
      when "get"
        zone_id=(params[:zone_id].nil? || params[:zone_id]=='')? -1 : params[:zone_id].to_i
        str=ActiveRecord::Base.connection.quote(params[:str].to_s.strip)
        
        res=ActiveRecord::Base.connection.select_one("
        SELECT
          pt.id,
          pt.name,
          pt.code,
          pt.address,
          sd.monday,
          sd.tuesday,
          sd.wednesday,
          sd.thursday,
          sd.friday,
          sd.saturday,
          sd.sunday
        FROM
          pps_terminal pt
          LEFT JOIN pps_terminal_skip_days sd ON sd.terminal_id=pt.id
        WHERE
          (
            #{str}=''
            OR
            pt.code like '%'+#{str}+'%'
            OR
            pt.address like '%'+#{str}+'%'
            OR
            pt.name like '%'+#{str}+'%'
          )
          AND
          (
            #{zone_id}=-1
            OR
            pt.id IN (SELECT pzt.pps_terminal FROM pps_zone_terminal pzt WHERE pzt.zoneid=#{zone_id})
          )")
        
        render :text => res.to_json
      when "put"
        terminal_id=params[:terminal_id]
        monday=params[:monday].to_i
        tuesday=params[:tuesday].to_i
        wednesday=params[:wednesday].to_i
        thursday=params[:thursday].to_i
        friday=params[:friday].to_i
        saturday=params[:saturday].to_i
        sunday=params[:sunday].to_i
        
        if (monday+tuesday+wednesday+thursday+friday+saturday+sunday>=1)
          ActiveRecord::Base.connection.execute("
          INSERT INTO pps_terminal_skip_days(
            terminal_id,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday
          )
          ON EXISTING UPDATE
          VALUES(
            #{terminal_id},
            #{monday},
            #{tuesday},
            #{wednesday},
            #{thursday},
            #{friday},
            #{saturday},
            #{sunday}
          )")
        else
          ActiveRecord::Base.connection.execute("
          DELETE FROM pps_terminal_skip_days WHERE terminal_id=#{terminal_id}")
        end
        
        render :text => {"success" => true}.to_json
    end
  end
end