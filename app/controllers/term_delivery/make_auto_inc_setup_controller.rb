# encoding: utf-8

class TermDelivery::MakeAutoIncSetupController < ApplicationSimpleErrorController
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
    WHERE
      spv_id=5626
    ORDER BY
      name")

    render :text => res.to_json
  end

  def get_periods
    res=ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      SUBSTR(CONVERT(varchar(10), ddateb, 120), 1, 7) name
    FROM
      period
    ORDER BY
      ddateb desc")

    render :text => res.to_json
  end

  def pps_zone_normes

    case request.method.to_s
    when "get"
      begin
        ddateb=Time.parse(params[:ddateb]).strftime('%F')
        ddatee=Time.parse(params[:ddatee]).strftime('%F')

        normes_list = ActiveRecord::Base.connection.select_all("
        SELECT
          CONVERT(varchar(30), pzn.zone) + '_' + CONVERT(varchar(30), pzn.period) id,
          pzn.zone,
          pzn.period,
          pzn.wdvalue,
          pzn.satvalue,
          pzn.sunvalue
        FROM
          pps_zone_norm pzn
          JOIN period p ON p.id=pzn.period
          JOIN pps_zone pz ON pz.id=pzn.zone
        WHERE
          dbo.isect('#{ddateb}', '#{ddatee}', p.ddateb, p.ddatee)>0
        ORDER BY
          pz.name,
          p.ddateb")

        render :text => normes_list.to_json
      end
    when "post"
      zone=nullify_int params[:zone]
      period=nullify_int params[:period]

      ActiveRecord::Base.connection.execute(
      "INSERT INTO pps_zone_norm(
        zone,
        period,
        wdvalue,
        satvalue,
        sunvalue)
      VALUES(
        #{nullify_int params[:zone]},
        #{nullify_int params[:period]},
        #{params[:wdvalue].to_i},
        #{params[:satvalue].to_i},
        #{params[:sunvalue].to_i})")

      render :text => {"id" => "#{zone}_#{period}"}.to_json
    when "put"
      strs=params[:id].split('_')
      old_zone=strs[0].to_i
      old_period=strs[1].to_i
      zone=nullify_int params[:zone]
      period=nullify_int params[:period]
      ActiveRecord::Base.connection.execute(
      "UPDATE pps_zone_norm SET
        zone=#{zone},
        period=#{period},
        wdvalue=#{params[:wdvalue]},
        satvalue=#{params[:satvalue]},
        sunvalue=#{params[:sunvalue]}
      WHERE
        zone=#{old_zone} AND period=#{old_period}")

      render :text => {"id" => "#{zone}_#{period}"}.to_json
    when "delete"
      strs=params[:id].split('_')
      old_zone=strs[0].to_i
      old_period=strs[1].to_i
      ActiveRecord::Base.connection.execute("
      DELETE FROM pps_zone_norm WHERE zone=#{old_zone} AND period=#{old_period}")

      render :text => {"success" => true}.to_json
    end
  end

  def pps_zone_workdays

    case request.method.to_s
    when "get"
      begin
        ddateb=Time.parse(params[:ddateb]).strftime('%F')
        ddatee=Time.parse(params[:ddatee]).strftime('%F')

        normes_list = ActiveRecord::Base.connection.select_all("
        SELECT
          pzw.ddate id,
          pzw.ddate,
          pzw.type
        FROM
          pps_zone_workday pzw
        WHERE
          pzw.ddate BETWEEN '#{ddateb}' AND '#{ddatee}'
        ORDER BY
          pzw.ddate")

        render :text => normes_list.to_json
      end
    when "post"
      ddate=Time.parse(params[:ddate]).strftime('%F')

      ActiveRecord::Base.connection.execute(
      "INSERT INTO pps_zone_workday(
        ddate,
        type)
      VALUES(
        '#{ddate}',
        #{nullify_int params[:type]})")

      render :text => {"id" => "#{ddate}"}.to_json
    when "put"
      id=Time.parse(params[:id]).strftime('%F')
      ddate=Time.parse(params[:ddate]).strftime('%F')
      ActiveRecord::Base.connection.execute(
      "UPDATE pps_zone_workday SET
        ddate='#{ddate}',
        type=#{nullify_int params[:type]}
      WHERE
        ddate='#{id}'")

      render :text => {"id" => "#{ddate}"}.to_json
    when "delete"
      ddate=Time.parse(params[:id]).strftime('%F')
      ActiveRecord::Base.connection.execute("
      DELETE FROM pps_zone_workday WHERE ddate='#{ddate}'")

      render :text => {"success" => true}.to_json
    end
  end
end