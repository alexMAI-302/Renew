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
        res=ActiveRecord::Base.connection.select_all("
          SELECT
            pt.id,
            pt.name,
            pt.code,
            pt.address,
            GET_BIT(sd.week_days, 2) monday,
            GET_BIT(sd.week_days, 3) tuesday,
            GET_BIT(sd.week_days, 4) wednesday,
            GET_BIT(sd.week_days, 5) thursday,
            GET_BIT(sd.week_days, 6) friday,
            GET_BIT(sd.week_days, 7) saturday,
            GET_BIT(sd.week_days, 1) sunday,
            sd.exclude,
            pt.info
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
            )
          ORDER BY
            pt.name")
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

      render :text => {"success" => true}.to_json
    end
  end
end