class RenewUrlTypesController < ApplicationController
  def index
    @renew_url_types = RenewUrlType.all
	
    @renew_url_type = RenewUrlType.new

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @renew_url_types }
    end
  end

  def save
	params[:renew_url_types].each_key do |id|
		@renew_url_type = RenewUrlType.find(id)
		@renew_url_type.update_attribute('name', params[:renew_url_types][id])
	end
	redirect_to :action => 'index'
  end
  
  def create
    @renew_url_type = RenewUrlType.new('name'=>params[:renew_url_type])
	if @renew_url_type.save
		redirect_to :action => 'index'
	end
  end

  def destroy
    @renew_url_type = RenewUrlType.find(params[:id])
    @renew_url_type.destroy

    redirect_to :action => 'index'
  end
end
