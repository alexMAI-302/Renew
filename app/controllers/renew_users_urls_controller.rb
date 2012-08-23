# encoding: utf-8

class RenewUsersUrlsController < ApplicationPageErrorController
  def index
    set_conditions
	
	puts "selected group: #{@selected_group}, selected url: #{@selected_url}"
  
    @renew_users_urls = RenewUsersUrl.all(:conditions => [" (renew_user_group_id = :group or :group = 0) and (renew_user_url_id = :url or :url = 0) and NOT (:group = 0 and :url = 0)", 
                                                          {:group => @selected_group, :url => @selected_url}])

    @renew_users_url = RenewUsersUrl.new

    @renew_urls = RenewUrl.all(:order => "name")
    @renew_groups = RenewUserGroup.all(:order => "name")
  end

  def save
    @items=params[:renew_users_urls].to_hash
	@items.each_key do |group_id|
		@items[group_id].each_key do |url_id|
			RenewUsersUrl.update_all(
			{:renew_user_group_id => @items[group_id][url_id][:group],
			:renew_user_url_id => @items[group_id][url_id][:url]},
			{'renew_user_group_id'=>group_id,
			'renew_user_url_id'=>url_id})
		end
	end
	redirect_to :action => 'index'
  end
  
  def create
    @renew_users_url = RenewUsersUrl.new(
		'renew_user_group_id'=>params[:renew_users_url][:group],
		'renew_user_url_id'=>params[:renew_users_url][:url])
	if @renew_users_url.save
		redirect_to :action => 'index'
	end
  end

  def destroy
    RenewUsersUrl.delete_all(
		{:renew_user_group_id=>params[:group_id],
		:renew_user_url_id=>params[:url_id]})

    redirect_to :action => 'index'
  end

private

  def set_conditions
    if params[:renew_groups]
      @selected_group = params[:renew_groups].to_i
      session[:renew_groups] = @selected_group
    else
      if session[:renew_groups]
        @selected_group = session[:renew_groups].to_i
      else
        @selected_group = RenewUserGroup.first(:order => "name").id
      end
    end

    if params[:renew_urls]
      @selected_url = params[:renew_urls].to_i
      session[:renew_urls] = @selected_url
    else
      if session[:renew_urls]
        @selected_url = session[:renew_urls].to_i
      else
        @selected_url = RenewUrl.first(:order => "name").id
      end
    end
  end
end
