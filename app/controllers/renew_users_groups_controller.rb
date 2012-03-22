class RenewUsersGroupsController < ApplicationController
  def index
    set_conditions
  
    @renew_users_groups = RenewUsersGroup.all(:conditions => [" (renew_user_group_id = :group or :group = 0) and (renew_user_id = :user or :user = 0) and NOT (:group = 0 and :user = 0)", 
                                                          {:group => @selected_group, :user => @selected_user}])

    @renew_users_group = RenewUsersGroup.new

    @renew_users = RenewUser.all(:order => "name")
    @renew_groups = RenewUserGroup.all(:order => "name")
  end

  def save
    @items=params[:renew_users_groups].to_hash
	@items.each_key do |group_id|
		@items[group_id].each_key do |user_id|
			RenewUsersGroup.update_all(
			{:renew_user_group_id => @items[group_id][user_id][:group],
			:renew_user_id => @items[group_id][user_id][:user]},
			{'renew_user_group_id'=>group_id,
			'renew_user_id'=>user_id})
		end
	end
	redirect_to :action => 'index'
  end
  
  def create
    @renew_users_group = RenewUsersGroup.new(
		'renew_user_group_id'=>params[:renew_users_group][:group],
		'renew_user_id'=>params[:renew_users_group][:user])
	if @renew_users_group.save
		redirect_to :action => 'index'
	end
  end

  def destroy
    RenewUsersGroup.delete_all(
		{:renew_user_group_id=>params[:group_id],
		:renew_user_id=>params[:user_id]})

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

    if params[:renew_users]
      @selected_user = params[:renew_users].to_i
      session[:renew_users] = @selected_user
    else
      if session[:renew_users]
        @selected_user = session[:renew_users].to_i
      else
        @selected_user = RenewUser.first(:order => "name").id
      end
    end
  end
end
