# encoding: utf-8

class RenewUsersController < ApplicationPageErrorController
  def index
    @renew_users = RenewUser.all(:order => "name")

    @renew_user = RenewUser.new

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @renew_url_types }
    end
  end

  def save
	params[:renew_users].each_key do |id|
		@renew_user = RenewUser.find(id)
		@renew_user.update_attribute('name', params[:renew_users][id])
	end
	redirect_to :action => 'index'
  end
  
  def create
    @renew_user = RenewUser.new('name'=>params[:renew_user])
	if @renew_user.save
		redirect_to :action => 'index'
	end
  end

  def destroy
    @renew_user = RenewUser.find(params[:id])
    @renew_user.destroy

    redirect_to :action => 'index'
  end
end
