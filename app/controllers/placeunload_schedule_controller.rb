# encoding: utf-8
class PlaceunloadScheduleController < ApplicationSimpleErrorController
  def index
  end

  def get
    only_without_schedule = params[:only_without_schedule]=='true'? 1 : 0
    res=ActiveRecord::Base.connection.select_all(
"select
    id,
    name,
    address,
    day_of_week,
    podr,
    podr_tooltip
from
    dbo.ask_placeunload_schedule (#{params[:salesman_id].to_i}, '#{Time.parse(params[:ddate]).strftime('%F')}', #{only_without_schedule})")

    render :text => res.to_json
  end

  def save
    day_of_week=params[:day_of_week].to_i
    if day_of_week>=1 && day_of_week<32
      ActiveRecord::Base.connection.execute("
      BEGIN
        LOCK TABLE placeunload_schedule IN EXCLUSIVE MODE;
        IF EXISTS(SELECT * FROM placeunload_schedule WHERE placeunload_id=#{params[:id].to_i} and ddateb='#{Time.parse(params[:ddate]).strftime('%F')}') THEN
          UPDATE placeunload_schedule
          SET day_of_week = #{params[:day_of_week].to_i}
          WHERE
            placeunload_id=#{params[:id].to_i} and ddateb='#{Time.parse(params[:ddate]).strftime('%F')}'
        ELSE
          INSERT INTO placeunload_schedule (id, placeunload_id, day_of_week, ddateb)
          VALUES(idgenerator('placeunload_schedule'), #{params[:id].to_i}, #{params[:day_of_week].to_i}, '#{Time.parse(params[:ddate]).strftime('%F')}');
        END IF;
      END")
    else
      ActiveRecord::Base.connection.execute("
      DELETE FROM placeunload_schedule WHERE placeunload_id=#{params[:id].to_i} and ddateb='#{Time.parse(params[:ddate]).strftime('%F')}';")
    end

    render :text => {"success" => true}.to_json
  end

  def get_salesman
    res = ActiveRecord::Base.connection.select_all("
    SELECT TOP 50
      id,
      name
    FROM
      partners_groups
    WHERE
      partners_groups.name LIKE '%'+'#{ActiveRecord::Base.connection.quote_string(params[:query])}'+'%'
      AND
      EXISTS (SELECT * FROM partners WHERE partners.parent=partners_groups.id)
    ORDER BY
      partners_groups.name")

    render :text => res.to_json
  end
end