# encoding: utf-8
class PpsZoneUsersController < ApplicationSimpleErrorController

  def index

  end
  
  def get_users
    users=RenewUser.find(:all, :select => "id, name", :order => "name")
	users.unshift({:id => 0, :name => "ВСЕ"})
    render :text => users.to_json
  end
  
  def get_zones
	pps_zones=PpsZone.find(:all, :select => "id, name", :order => "name")
	pps_zones.unshift({:id => 0, :name => "ВСЕ"})
	render :text => pps_zones.to_json
  end
  
  def zone_users
	
	
    case request.method.to_s
		when "post"
			zone_id=params[:zone_id]
			user_id=params[:user_id]
			
			ActiveRecord::Base.connection.insert("INSERT INTO renew_user_zone(zone, renew_user_id) VALUES (#{zone_id}, #{user_id})")
			
			render :text=>"[]"
		when "delete"
			strs=params[:id].split("_")
			zone_id=strs[0]
			user_id=strs[1]
			begin
				ActiveRecord::Base.connection.delete("DELETE FROM renew_user_zone WHERE zone=#{zone_id} AND renew_user_id=#{user_id}")
			rescue => t
				puts "#{t}"
			end
			
			render :text=>"[]"
		when "get"
			zone_id=params[:zone_id]
			user_id=params[:user_id]
	
			data = ActiveRecord::Base.connection.select_all("
			SELECT
				zone zone_id,
				renew_user_id user_id
			FROM
				renew_user_zone ruz
			WHERE
				(0=#{zone_id} OR zone=#{zone_id}) AND
				(0=#{user_id} OR renew_user_id=#{user_id})")
			render :text => data.to_json
	end
  end
end
