# encoding: utf-8
# Группы пользователей
class RenewUserGroupsController < ApplicationController
  def index
    @renew_user_groups = RenewUserGroup.all(:order => "name")

    @renew_user_group = RenewUserGroup.new

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @renew_url_types }
    end
  end

  def save
	params[:renew_user_groups].each_key do |id|
		@renew_user_group = RenewUserGroup.find(id)
		@renew_user_group.update_attribute('name', params[:renew_user_groups][id])
	end
	redirect_to :action => 'index'
  end
  
  def create
    @renew_user_group = RenewUserGroup.new('name'=>params[:renew_user_group])
	if @renew_user_group.save
		redirect_to :action => 'index'
	end
  end

  def destroy
    @renew_user_group = RenewUserGroup.find(params[:id])
    @renew_user_group.destroy

    redirect_to :action => 'index'
  end
end
