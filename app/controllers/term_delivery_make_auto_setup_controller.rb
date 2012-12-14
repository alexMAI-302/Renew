# encoding: utf-8

class TermDeliveryMakeAutoSetupController < ApplicationSimpleErrorController
  def index
  end
  
  def zones
    case request.method.to_s
      when "get"
        res=ActiveRecord::Base.connection.select_all("
        SELECT
          pz.id,
          pz.name,
          IF az.id IS NOT NULL THEN 1 ELSE 0 END IF selected
        FROM
          pps_zone pz
          LEFT JOIN spp.terminal_delivery_make_auto_zones az ON pz.id=az.id
        WHERE
          z.spv_id=6626
        ORDER BY
          pz.name")
        
        render :text => res.to_json
      when "put"
        ActiveRecord::Base.connection.update("
        IF #{params[:selected]?1:0} = 1 THEN
          INSERT INTO spp.terminal_delivery_make_auto_zones(id)
          ON EXISTING SKIP
          VALUES(#{params[:id].to_i})
        ELSE
          DELETE FROM spp.terminal_delivery_make_auto_zones
          WHERE id=#{params[:id].to_i}
        END IF")
        
        render :text => {"success" => true, "id" => params[:id]}.to_json
    end
  end
  
  def info
    case request.method.to_s
      when "get"
        res=ActiveRecord::Base.connection.select_one("
        SELECT
          IF e.enabled='Y' THEN 1 ELSE 0 END IF enabled,
          s.start_time,
          s.stop_time,
          s.interval_amt
        FROM
          SYS.SYSEVENT e
          JOIN SYS.SYSSCHEDULE s ON e.event_id=s.event_id
        WHERE
          e.event_name='terminal_delivery_make_auto'")
        
        render :text => res.to_json
      when "post"
        if params[:interval_amt].to_i>=10 && params[:interval_amt].to_i<60
          ActiveRecord::Base.connection.execute("
          BEGIN
            ALTER EVENT spp.terminal_delivery_make_auto
              ALTER SCHEDULE term_delivery_make_schedule
                BETWEEN '#{Time.parse(params[:start_time].gsub(/[T]/, ' ')).strftime('%T')}'
                AND
                '#{Time.parse(params[:stop_time].gsub(/[T]/, ' ')).strftime('%T')}'
                EVERY #{params[:interval_amt].to_i} MINUTES;
            IF #{params[:enabled].to_i} = 1 THEN
              ALTER EVENT spp.terminal_delivery_make_auto ENABLE
            ELSE
              ALTER EVENT spp.terminal_delivery_make_auto DISABLE
            END IF;
          END")
          
          render :text => {"success" => true}.to_json
        else
          render :text => {"success" => true, message => "Неправильное значение интервала"}.to_json
        end
    end
  end
end