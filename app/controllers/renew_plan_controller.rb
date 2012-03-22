class RenewPlanController < ApplicationController

  def get_renew_plans
	ddateb="'#{params[:ddateb]}'"
	ddatee=(params[:ddatee])?(", '#{params[:ddatee]}'"):('')
    renew_plans = Proxycat.connection.select_all("exec ask_renew_plan #{ddateb} #{ddatee}")
	
	render :text => renew_plans.to_json
  end
  
  def get_site_to_storages
	site_storages=Proxycat.connection.select_all("SELECT id, storage_name, site_to, site_from FROM site_to_storages")
	
	render :text => site_storages.to_json
  end

  def index
  end
  
  def do_renew_eremsite
	rst = Proxycat.connection.select_all('exec prc_eremsite')
  end
  
  def get_refreshddate
	refreshddate = ActiveRecord::Base.connection.select_value('select max(ts) from dbo.eremsite')
	render :text => {:refresh_ddate => refreshddate}.to_json
  end

  def do_plan
    renew_plan_id=params[:id]
    site_to_storage=params[:site_to_storage]
    es = "declare @res int exec prc_renew_plan #{renew_plan_id}, #{site_to_storage} , @res OUTPUT select @res res"
    puts 'Executing: ' + es
    r = Proxycat.connection.select_all( es ) 
    puts 'Well done: ' + r[0]['res'].to_s

	render :text => {:res => r[0]['res']}.to_json
  end

  def do_sorder
    renew_plan_id=params[:id]
    site_to_storage=params[:site_to_storage]
    es = "declare @res int exec prc_renew_sale_order #{renew_plan_id}, #{site_to_storage} , @res OUTPUT select @res res"
    puts 'Executing: ' + es
    r = Proxycat.connection.select_all( es ) 
    puts 'Well done: ' + r[0]['res'].to_s

	render :text => (r[0]['res']==2)?("lackvol"):"ok"
  end
 
  def do_sorder_status1
	begin
		es = 'declare @res int exec prc_renew_status1 '+ params[:id] + ', @res OUTPUT select @res res'
		puts 'Executing: ' + es
		r = Proxycat.connection.select_all( es )
		puts 'Well done: ' + r[0]['res'].to_s

		render :text => {:res => r[0]['res']}.to_json
	rescue => t
		render :text => t, :status => 500
	end
  end
end