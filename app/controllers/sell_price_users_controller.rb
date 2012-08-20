# encoding: utf-8

class SellPriceUsersController < ApplicationSimpleErrorController

  def index

  end
  
  def get_users
    users=RenewUser.find(:all, :select => "id, name", :order => "name")
	users.unshift({:id => 0, :name => "ВСЕ"})
    render :text => users.to_json
  end
  
  def get_partner_groups
	partner_groups=Proxycat.connection.select_all("exec ask_sell_price_partners")
	partner_groups.unshift({:id => '0', :name => "ВСЕ"})
	render :text => partner_groups.to_json
  end
  
  def sell_price_users
	partner_group_id=params[:partner_group_id]
	user_id=params[:user_id]
	
    case request.method.to_s
		when "put"
		begin
			ActiveRecord::Base.connection.execute("
			INSERT INTO renew_web.renew_user_sell_price(partner_group_id, renew_user_id)
			ON EXISTING SKIP
			VALUES (#{partner_group_id}, #{user_id})")
			
			render :text=>"[]"
		end
		when "post"
		begin
			ActiveRecord::Base.connection.execute("
			INSERT INTO renew_web.renew_user_sell_price(partner_group_id, renew_user_id)
			ON EXISTING SKIP
			VALUES (#{partner_group_id}, #{user_id})")
			
			render :text=>"[]"
		end
		when "delete"
		begin
			ActiveRecord::Base.connection.execute("
			DELETE FROM renew_web.renew_user_sell_price
			WHERE
				partner_group_id = #{partner_group_id}
				AND
				renew_user_id=#{user_id}")
			
			render :text=>"[]"
		end
		when "get"
		begin
			data = ActiveRecord::Base.connection.select_all("
			SELECT
				CONVERT(varchar(30), partner_group_id)+'_'+CONVERT(varchar(30), user_id) id,
				partner_group_id,
				renew_user_id user_id
			FROM
				renew_web.renew_user_sell_price rusp
			WHERE
				(#{partner_group_id}=0 OR partner_group_id=#{partner_group_id}) AND
				(0=#{user_id} OR renew_user_id=#{user_id})")
			
			render :text => data.to_json
		end
	end
  end
end