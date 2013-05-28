# encoding: utf-8
class PlaceunloadScheduleController < ApplicationSimpleErrorController
  def index
  end

  def get
    only_without_schedule = params[:only_without_schedule]=='true'? 1 : 0
    res=ActiveRecord::Base.connection.select_all("
    SELECT
      pl.id,
      ISNULL(pl.name, b.name) name,
      pl.address,
      ps.day_of_week
    FROM
      placeunload pl
      JOIN buyers b ON b.placeunload_id=pl.id
      JOIN partners p ON p.id=b.partner
      JOIN partners_groups_tree pgt ON pgt.id=p.parent
      LEFT JOIN placeunload_schedule ps ON ps.placeunload_id=pl.id
    WHERE
      pgt.parent = #{params[:salesman_id].to_i}
      AND
      (ps.id IS NOT NULL AND '#{Time.parse(params[:ddate]).strftime('%F')}' BETWEEN ps.ddateb AND ps.ddatee
      OR
      ps.id IS NULL)
      AND
      (
        (#{only_without_schedule}=0)
        OR
        (#{only_without_schedule}=1 AND ps.day_of_week IS NULL)
      )
    ORDER BY
      2")

    render :text => res.to_json
  end

  def save
    day_of_week=params[:day_of_week].to_i
    if day_of_week>=1 && day_of_week<=5
      ActiveRecord::Base.connection.execute("
      BEGIN
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
      partners_groups.id,
      partners_groups.name
    FROM 
      pref_concept 
      JOIN prefs ON pref_concept.id = prefs.concept AND pref_concept.type = prefs.type
      JOIN partners_groups ON prefs.id = partners_groups.id
    WHERE 
      pref_concept.type = 1 AND 
      pref_concept.name = 'Хр: Партнеры - Торг.предст.'
      AND
      partners_groups.name LIKE 'Актив_%'+'#{ActiveRecord::Base.connection.quote_string(params[:query])}'+'%'
    ORDER BY
      partners_groups.name")

    render :text => res.to_json
  end
end