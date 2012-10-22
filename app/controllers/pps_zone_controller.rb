# encoding: utf-8
# терминалы
class PpsZoneController < ApplicationSimpleErrorController

  def index

  end
  
  def get_zone_types
    zone_types=SpValue.find(:all,
	:select => "id, name",
	:conditions => 'id IN (SELECT DISTINCT spv_id FROM pps_zone)',
	:order => :name)
    render :text => zone_types.to_json
  end
  
  def zones
	case request.method.to_s
		when "post"
		begin
			pps_zone=PpsZone.new(
			  :bound_notes => params[:bound_notes],
			  :status => params[:status],
			  :name => params[:name],
			  :spv_id => params[:spv_id],
			  :visit_freq => params[:visit_freq],
			  :subdealerid => 7,
			  :bound_summ => params[:bound_summ],
			  :branch => params[:branch])
			pps_zone.id = ActiveRecord::Base.connection.select_value("SELECT idgenerator('pps_zone')")
			pps_zone.save
		end
		when "put"
		begin
			PpsZone.update(
			  params[:id],
			  {:bound_notes => params[:bound_notes],
			  :status => params[:status],
			  :name => params[:name],
			  :spv_id => params[:spv_id],
			  :visit_freq => params[:visit_freq],
			  :bound_summ => params[:bound_summ],
			  :branch => params[:branch]})
		end
		when "delete"
		begin
			PpsZone.delete(params[:id])
			render :text=>""
		end
		when "get"
		begin
			zone_type_id=params[:zone_type_id]
			pps_zones=PpsZone.find(:all,
				:conditions => {:spv_id=>zone_type_id},
				:include => :zone_type)
			render :text => pps_zones.to_json
		end
	end
  end
  
  def save_zone_points
    pps_zone=PpsZone.update(params[:id], {:points => params[:points]})
	
	single_strings=params[:points_str].split(';')
	query_insert_points=""
	single_strings.each_with_index do |single_string|
		query_insert_points+="INSERT INTO geozone_coordinates (id, pps_zone, number, longitude, latitude) VALUES(idgenerator('geozone_coordinates'), #{pps_zone.id}, #{single_string});"
	end
	
	ActiveRecord::Base.connection.execute("
		DELETE FROM geozone_coordinates WHERE pps_zone=#{params[:id]};
		#{query_insert_points}")
	
	render :text => pps_zone.to_json
  end
  
  def terminals
    case request.method.to_s
		when "put"
		begin
			id=params[:id]
			visit_freq=(params[:visit_freq].nil? || params[:visit_freq]=="")?("NULL"):(params[:visit_freq].to_i)
			bound_notes=params[:bound_notes]
			bound_summ=params[:bound_summ]
			name=params[:name]
			has_zone_bind=params[:has_zone_bind]
			zone_id=params[:zone_id]
			required=params[:required]?1:0
			
			terminal=PpsTerminal.update(id,
			  {:bound_notes => params[:bound_notes],
			  :name => params[:name],
			  :bound_summ => params[:bound_summ]})
			
			avg_notes=params[:avg_notes]
			stdev_notes=params[:stdev_notes]
			opt_bound=params[:opt_bound]
			avg_summ=params[:avg_summ]
			stdev_summ=params[:stdev_summ]
			opt_bound_summ=params[:opt_bound_summ]
			
			sql="
				INSERT INTO pps_terminal_stat(
					terminalid,
					visit_freq,
					avg_notes,
					stdev_notes,
					opt_bound,
					avg_summ,
					stdev_summ,
					opt_bound_summ
				)
				ON EXISTING UPDATE
				VALUES(
					#{terminal.terminalID},
					#{visit_freq},
					#{avg_notes},
					#{stdev_notes},
					#{opt_bound},
					#{avg_summ},
					#{stdev_summ},
					#{opt_bound_summ});
				"
			
			if has_zone_bind==true then
				sql+="
					INSERT INTO pps_zone_terminal(zoneid, pps_terminal)
					ON EXISTING SKIP
					VALUES (#{zone_id}, #{id});
					update	 pps_zone_terminal
					set	required=#{required}
					WHERE  zoneid = #{zone_id} AND pps_terminal = #{id};
				"
				
			else
				sql+="
					DELETE FROM pps_zone_terminal WHERE
					zoneid = #{zone_id} AND pps_terminal = #{id}
				"
			end
			
			ActiveRecord::Base.connection.execute(sql)
			render :text=>terminal.to_json
		end
		when "get"
		begin
			terminals=PpsTerminal.find(:all,
				:select => " 
					pps_terminal.id id,
					pps_terminal.name name,
					(SELECT
						list(pz.name)
					FROM
						pps_zone pz
						JOIN pps_zone_terminal pzt ON pzt.zoneid=pz.id
					WHERE
						pzt.pps_terminal=pps_terminal.id) zone_names,
					(SELECT sc.name FROM src_system sc WHERE sc.id=pps_terminal.src_system) src_system_name,
					g.latitude,
					g.longitude,
					IF EXISTS(SELECT 1 FROM pps_zone_terminal pzt WHERE pzt.zoneid = #{params[:zone_id]} AND pzt.pps_terminal=pps_terminal.id) THEN 1 ELSE 0 END IF has_zone_bind,
					IF (geo_bind.id IS NOT NULL) THEN
						1
					ELSE
						0
					END IF has_geo_zone_bind,
					isnull((SELECT top 1 pzt.required FROM pps_zone_terminal pzt WHERE pzt.zoneid = #{params[:zone_id]} AND pzt.pps_terminal=pps_terminal.id),0) required,
					pts.avg_notes,
					pts.stdev_notes,
					pps_terminal.bound_notes bound_notes,
					pps_terminal.bound_summ bound_summ,
					pts.opt_bound,
					pts.avg_summ,
					pts.stdev_summ,
					pts.opt_bound_summ
					",
				:joins => "
					JOIN geoaddress g ON g.id=pps_terminal.geoaddressid
					LEFT JOIN pps_terminal_stat pts ON pts.terminalID=pps_terminal.terminalID AND pts.visit_freq=#{params[:visit_freq]}
					LEFT JOIN (SELECT id FROM ask_terminals_in_zone(#{params[:zone_id]})) geo_bind ON geo_bind.id=pps_terminal.id",
				:conditions => [
					"main_subdealerid = 7 AND
					(
						(geo_bind.id IS NOT NULL
						AND
						pps_terminal.isdeleted = 0
						AND
						exists(select 1 from cache_terminal_status cts where cts.lastactivitytime > dateadd(day, -15, today()) and cts.src_system = pps_terminal.src_system and cts.terminalid = pps_terminal.terminalid))
						OR
						EXISTS(SELECT 1 FROM pps_zone_terminal pzt WHERE pzt.zoneid = :zone_id AND pzt.pps_terminal=pps_terminal.id)
					)",
					{:zone_id => params[:zone_id],
					:left_longitude => params[:left_longitude], :right_longitude=> params[:right_longitude],
					:top_latitude => params[:top_latitude], :bottom_latitude => params[:bottom_latitude]}],
				:order => "pps_terminal.name")
			render :text => terminals.to_json
		end
	end
  end
end