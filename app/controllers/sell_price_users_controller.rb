# encoding: utf-8

class SellPriceUsersController < ApplicationController

  def index

  end
  
  def get_users
    users=RenewUser.find(:all, :select => "id, name", :order => "name")
	users.unshift({:id => 0, :name => "ВСЕ"})
    render :text => users.to_json
  end
  
  def get_partner_groups
	partner_groups=Proxycat.connection.select_all("exec ask_sell_price_partners")
	partner_groups.unshift({:id => '0_0', :name => "ВСЕ"})
	render :text => partner_groups.to_json
  end
  
  def sell_price_users
	strs=params[:partner_group_id].split("_")
	partner_group_id=strs[0]
	site_id=strs[1]
	user_id=params[:user_id]
	
    case request.method.to_s
		when "put"
		begin
			Proxycat.connection.execute("
			exec dbo.prc_ins_sell_price_users #{partner_group_id}, #{site_id}, #{user_id}")
			
			render :text=>"[]"
		end
		when "post"
		begin
			Proxycat.connection.execute("
			exec dbo.prc_ins_sell_price_users #{partner_group_id}, #{site_id}, #{user_id}")
			
			render :text=>"[]"
		end
		when "delete"
		begin
			Proxycat.connection.execute("
			exec dbo.prc_del_sell_price_users #{partner_group_id}, #{site_id}, #{user_id}")
			
			render :text=>"[]"
		end
		when "get"
		begin
			data = Proxycat.connection.select_all("
			exec dbo.ask_sell_price_users #{partner_group_id}, #{site_id}, #{user_id}")
			render :text => data.to_json
		end
	end
  end
end