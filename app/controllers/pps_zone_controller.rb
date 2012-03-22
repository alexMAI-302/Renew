# encoding: utf-8
class PpsZoneController < ApplicationController

  def index

  end
  
  def get_subdealers
    subdealers=PpsSubdealer.find(:all,
	:select => "subdealerid id, name",
	:conditions => 'subdealerid in (select main_subdealerid from pps_terminal where isdeleted=0)',
	:order => :name)

    render :text => subdealers.to_json
  end
  
  def get_zone_types
    zone_types=SpValue.find(:all,
	:select => "id, name",
	:conditions => 'id IN (SELECT DISTINCT spv_id FROM pps_zone)',
	:order => :name)
    render :text => zone_types.to_json
  end
  
  def get_branches
    zone_types=ActiveRecord::Base.connection.select_all("SELECT id, name FROM branch")
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
			  :subdealerid => params[:subdealerid],
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
			  :subdealerid => params[:subdealerid],
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
			zone_type_id=params[:zoneType]
			subdealer_id=params[:subdealer]
			pps_zones=PpsZone.find(:all,
				:conditions => {:spv_id=>zone_type_id, :subdealerid => subdealer_id},
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
		when "post"
		begin
			id=params[:fake_id].split('_')[0]
			old_zone=params[:fake_id].split('_')[1]
			visit_freq=(params[:visit_freq].nil? || params[:visit_freq]=="")?("NULL"):(params[:visit_freq].to_i)
			has_zone_bind=params[:has_zone_bind]
			zone_id=params[:zone_id]
			
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
			
			begin
				ActiveRecord::Base.connection.execute("
					UPDATE pps_terminal_stat pts SET
						pts.avg_notes=#{avg_notes},
						pts.stdev_notes=#{stdev_notes},
						pts.opt_bound=#{opt_bound},
						pts.avg_summ=#{avg_summ},
						pts.stdev_summ=#{stdev_summ},
						pts.opt_bound_summ=#{opt_bound_summ}
					WHERE
						pts.terminalid=#{id} AND
						IF isnull(#{visit_freq}, 1) = 0 THEN 1 ELSE isnull(#{visit_freq}, 1) ENDIF = pts.visit_freq
					")
			rescue => t
				puts "#{t}"
			end
			
			if has_zone_bind==true then
				begin
					ActiveRecord::Base.connection.execute("
						DELETE FROM pps_zone_terminal WHERE
						pps_terminal = #{id} AND zoneid=#{old_zone};
						INSERT INTO pps_zone_terminal(zoneid, pps_terminal)
						VALUES (#{zone_id}, #{id})
					")
				rescue => t
					puts "#{t}"
				end
			else
				begin
					ActiveRecord::Base.connection.execute("
						DELETE FROM pps_zone_terminal WHERE
						zoneid = #{zone_id} AND pps_terminal = #{id}
					")
				rescue => t
					puts "#{t}"
				end
			end
			render :text=>"{success}"
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
					pps_terminal.bound_notes bound_notes,
					pps_terminal.bound_summ bound_summ,
					g.latitude,
					g.longitude,
					IF EXISTS(SELECT 1 FROM pps_zone_terminal pzt WHERE pzt.zoneid = #{params[:zone_id]} AND pzt.pps_terminal=pps_terminal.id) THEN 1 ELSE 0 END IF has_zone_bind,
					IF (geo_bind.id IS NOT NULL) THEN
						1
					ELSE
						0
					END IF has_geo_zone_bind",
				:joins => "
					JOIN geoaddress g ON g.id=pps_terminal.geoaddressid
					LEFT OUTER JOIN (SELECT id FROM ask_terminals_in_zone(#{params[:zone_id]})) geo_bind ON geo_bind.id=pps_terminal.id",
				:conditions => [
					"main_subdealerid = :main_subdealerid AND
					(
						(geo_bind.id IS NOT NULL
						AND
						pps_terminal.isdeleted = 0
						AND
						exists(select 1 from cache_terminal_status cts where cts.lastactivitytime > dateadd(day, -15, today()) and cts.src_system = pps_terminal.src_system and cts.terminalid = pps_terminal.terminalid))
						OR
						EXISTS(SELECT 1 FROM pps_zone_terminal pzt WHERE pzt.zoneid = :zone_id AND pzt.pps_terminal=pps_terminal.id)
					)",
					{:main_subdealerid=>params[:subdealer], :zone_id => params[:zone_id],
					:left_longitude => params[:left_longitude], :right_longitude=> params[:right_longitude],
					:top_latitude => params[:top_latitude], :bottom_latitude => params[:bottom_latitude]}],
				:order => "pps_terminal.name")
			render :text => terminals.to_json
		end
	end
  end
end