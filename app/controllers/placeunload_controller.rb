# encoding: utf-8
class PlaceunloadController < ApplicationController

  protect_from_forgery :except => [:autocomplete_pgroup_name, :autocomplete_partner_name, :autocomplete_buyer_name]
    
  def set
	if params[:buyer]
		@buyer = ActiveRecord::Base.connection.select_one("select name, loadto from buyers where id = #{params[:buyer]}")
	end
  end
  
  def autocomplete_pgroup_name
	pname = params[:pgroup][:name] 
	
	@pg = Proxycat.connection.select_all( "exec placeunload_autocomplete_pgroup_name '#{pname}'") 
	
	render :layout => false
  end

  def autocomplete_partner_name
	@partners_time = {"Водители ООРТ" => 15, "Водители ОПТ" => 30, "VIP" => 60}
  
	pname = params[:partner][:name]
	pgid  = params[:partner][:parent] 	
	
	@pnames = Proxycat.connection.select_all( "exec placeunload_autocomplete_partner_name '#{pname}', #{pgid}")
		
	render :layout => false
  end
  
  def autocomplete_buyer_name
	bname = params[:buyer][:name]
    pid  = params[:buyer][:partner]
	
	@bnames = Proxycat.connection.select_all( "exec placeunload_autocomplete_buyer_name '#{bname}', #{pid}")
	
	render :layout => false
  end
  
  def add_buyer
	set_conditions
	@partner_id    = -1
	@pgroup_id     = -1
	@pgroup_name   = ""
	@partner_name  = ""
	@buyer_name    = ""
	@buyer_id      = -1
	@loadto        = ""
	@placeunload_id   = -1
	@placecategory_id = -1
	@unloading        = -1
	@delscheduleid    = 4384
	@incscheduleid    = 4384
	@buyers_route_id  = -1
	@descr            = ""
	@ischeck  = 1
	@placeunload_name = ""
	if session[:haserror] == 1
		@partner_id       = session[:placedata]["partner"]["id"].to_i
		@pgroup_id        = session[:placedata]["pgroup"]["id"].to_i
		@pgroup_name      = session[:placedata]["pgroup"]["name"]
		@partner_name     = session[:placedata]["partner"]["name"]
		@buyer_id         = session[:placedata]["buyer"]["id"].to_i
		@buyer_name       = session[:placedata]["buyer"]["name"]
		@loadto           = session[:placedata]["a"]["loadto"]
		@placeunload_id   = session[:placedata]["placeunload"]["id"].to_i
		@placecategory_id = session[:placedata]["placeunload"]["placecategory_id"].to_i
		@unloading        = session[:placedata]["placeunload"]["unloading"].to_i       
		@delscheduleid    = session[:placedata]["placeunload"]["delscheduleid"].to_i   
		@incscheduleid    = session[:placedata]["placeunload"]["incscheduleid"].to_i   
		@buyers_route_id  = session[:placedata]["placeunload"]["buyers_route_id"].to_i 
		@descr            = session[:placedata]["placeunload"]["descr"]           
		@ischeck            = session[:placedata]["placeunload"]["ischeck"]           
		@placeunload_name = session[:placedata]["placeunload"]["placeunload_name"]		                                            
		session[:haserror] = 0
	elsif params[:partner]
		@partners_time = {"Водители ООРТ" => 15, "Водители ОПТ" => 30, "VIP" => 60}
		
		@partner_id = params[:partner].to_i
		pa = Proxycat.connection.select_one("exec placeunload_add_buyer_partner #{@partner_id}")
		#logger.info pa["pgroup_name"]
		@pgroup_id    = (pa["pgroup_id"].nil?)?nil:(pa["pgroup_id"].to_i)
		@pgroup_name  = pa["pgroup_name"]
		@partner_name = pa["partner_name"]
		@buyer_name   = @partner_name
		@placeunload_name = @partner_name
		
		@unloading=@partners_time[pa["spv_name"]]
	elsif params[:buyer] 
		@buyer_id = params[:buyer].to_i
		
		pa = Proxycat.connection.select_one("exec placeunload_add_buyer_buyer #{@buyer_id}")
		
		@pgroup_id      = pa["pgroup_id"].to_i
		@pgroup_name    = pa["pgroup_name"]
		@partner_id     = pa["partner_id"].to_i
		@partner_name   = pa["partner_name"]
		@buyer_name     = pa["buyer_name"]
		@loadto         = pa["loadto"]
		@placeunload_id = pa["placeunload_id"].to_i
		@placeunload_name = pa["buyer_name"]
		@latitude  = pa["latitude"] || @latitude
		@longitude = pa["longitude"] || @longitude
	end
	@pgroup_descr  = @pgroup_id  < 0 ? "Не задана!" : ""
	@partner_descr = @partner_id < 0 ? "Новый!"     : ""
	@buyer_descr   = @buyer_id   < 0 ? "Новый!"     : "" 	
  end
  
  def find_place
  	@longitude = params[:longitude]
	@latitude  = params[:latitude]   
    @places = Proxycat.connection.select_all("exec find_place #{@latitude}, #{@longitude}")
	@pointsj = @places.to_json( :only => ["id", "name", "latitude", "longitude"] )	
	render :partial => 'upd_end' 
  end
  
  def find_place_fake
  	@longitude = params[:longitude]
	@latitude  = params[:latitude]
	
	@places=[]
	@pointsj = "[]"
	render :partial => 'upd_end' 
  end
  
  def save_buyer
    serr = Proxycat.connection.select_value("
	exec dbo.placeunload_save_buyer
	#{params[:partner][:id].to_i},
	#{params[:pgroup][:id].to_i},
	'#{params[:partner][:name].strip}',
	'#{params[:buyer][:name].strip}',
	#{params[:buyer][:id].to_i},
	#{params[:placeunload][:id].to_i},
    '#{params[:a][:loadto].strip}',
    '#{params[:a][:fulladdress]}',
	#{params[:a][:longitude]},
	#{params[:a][:latitude]},
	'#{params[:placeunload][:descr].strip}',
	#{params[:placeunload][:unloading]=="-1" ? 'null' : params[:placeunload][:unloading]},
	#{params[:placeunload][:delscheduleid]},
	#{params[:placeunload][:incscheduleid]},
	#{params[:placeunload][:buyers_route_id]=="-1" ? 'null' : params[:placeunload][:buyers_route_id]},
	#{params[:placeunload][:placecategory_id]}")
	if serr.size==0
		flash[:notice] = "Данные сохранены успешно"
	else
		flash[:notice] = "Ошибка:" + serr
		session[:haserror] = 1
		session[:placedata] = params.to_hash
	end
	redirect_to :action => :add_buyer
  end
  
  def index
	set_conditions
	
	if params[:id]
		@id=params[:id]
		flt='null'
		@flt_name='null'
		@flt_address='null'
		@flt_tp='null'
		@flt_ischeck='null'
		@flt_buyers_route_id='null'
		@flt_ddate='null'
		@flt_notgeo='null'
	else
		@id='null'
		if params[:flt]
			flt=1
			@flt_name             = params[:flt][:name].strip
			@flt_address          = params[:flt][:address].strip
			@flt_tp               = params[:flt][:tp].strip
			@flt_ischeck          = params[:flt][:ischeck].to_i
			@flt_buyers_route_id  = params[:flt][:buyers_route_id].to_i
			@flt_ddate			  = params[:flt][:ddate].to_i
			@flt_notgeo           = params[:flt][:notgeo].to_i
			session[:flt_name]    = @flt_name
			session[:flt_address] = @flt_address
			session[:flt_ischeck] = @flt_ischeck
			session[:flt_buyers_route_id] = @flt_buyers_route_id
			session[:flt_ddate]   = @flt_ddate
			session[:flt_notgeo]  = @flt_notgeo
		else
			flt='null'
			@flt_name = session[:flt_name]||"" 
			@flt_address = session[:flt_address] || ""
			@flt_tp = session[:flt_tp] || ""
			@flt_ischeck = session[:flt_ischeck] || -1 
			@flt_buyers_route_id = session[:flt_buyers_route_id] || 0 
			@flt_ddate = session[:flt_ddate] || 0
			@flt_ddate = session[:flt_ddate] || 0
			@flt_notgeo = session[:flt_notgeo] || 0
		end
	end
  	
	@rst_buyers=Proxycat.connection.select_all("exec placeunload_index
		#{@id},
		'#{@flt_name}',
		'#{@flt_address}',
		'#{@flt_tp}',
		#{@flt_ischeck},
		#{@flt_buyers_route_id},
		#{@flt_ddate},
		#{@flt_notgeo}")
	
	@rst_new = @rst_buyers.to_json( :only => [ "id", "longitude", "latitude", "pname" ] ) 
	if @rst_buyers.size > 0 
		if @rst_buyers[0]["longitude"] and @rst_buyers[0]["latitude"]
			@longitude = @rst_buyers[0]["longitude"]
			@latitude  = @rst_buyers[0]["latitude"]
		end
	end
  end

  def prov
  	@longitude = 37.498995
	@latitude  = 55.842610
	@buyers_route_list  = ActiveRecord::Base.connection.select_all( "select id, name from buyers_route
																	 order by 2" ).collect{|p| [ p["name"], p["id"] ]}
	if params[:flt]
		@flt_ischeck          = params[:flt][:ischeck].to_i
		@flt_buyers_route_id  = params[:flt][:buyers_route_id].to_i
		session[:flt_ischeck] = @flt_ischeck
		session[:flt_buyers_route_id] = @flt_buyers_route_id
	else
		@flt_ischeck = session[:flt_ischeck] || -1 
		@flt_buyers_route_id = session[:flt_buyers_route_id] || 0 
	end
	sw = "p.buyers_route_id = #{@flt_buyers_route_id}"
	if @flt_ischeck != -1 
		sw += " and isnull(p.ischeck,0) = #{@flt_ischeck}"
	end
	
  	@rst_buyers = ActiveRecord::Base.connection.select_all("
			select 
				p.id                			id,
				p.name              			pname,
				p.address           			srcaddress, 
				p.fulladdress       			fulladdress, 
				p.latitude          			latitude,
				p.longitude         			longitude,
				p.descr             			descr,
				isnull(p.placecategory_id,-1)  	placecategory_id,
				isnull(p.ischeck,0)            	ischeck
			from
				placeunload p
			where #{sw} order by p.name") 

	@rst_new = @rst_buyers.to_json( :only => [ "id", "longitude", "latitude", "pname" ] ) 
	if @rst_buyers.size > 0 
		if @rst_buyers[0]["longitude"] and @rst_buyers[0]["latitude"]
			@longitude = @rst_buyers[0]["longitude"]
			@latitude  = @rst_buyers[0]["latitude"]
		end
	end
	@menu_subjects=nil
  end
  
  def route
  	@longitude = 37.498995
	@latitude  = 55.842610
	@route_json = ActiveRecord::Base.connection.select_all( "select id, points from buyers_route where length(points) > 0 order by 2" ).to_json( )
  	@rst_buyers = ActiveRecord::Base.connection.select_all("
			select 
				p.id                			id,
				p.name              			pname,
				isnull(p.buyers_route_id,-1)    buyers_route_id ,
				p.longitude 					longitude,
				p.latitude						latitude
			from
				placeunload p
			where p.latitude > 0 and ischeck= 1") 

	@rst_new = @rst_buyers.to_json( :only => [ "id", "longitude", "latitude"] ) 
  end
  
  def save_point
    main_points = []
	add_points  = []
	if params[:a]
		params[:a].each_pair do |id, value|
			if value[:needsave] == "1"
				p = Placeunload.find( id )
				p.name = value[:pname]
				p.address = value[:srcaddress]
				p.fulladdress = value[:fulladdress]
				p.latitude = value[:latitude]
				p.longitude = value[:longitude]
				p.ischeck = value[:ischeck]
				p.descr           = value[:descr]
				p.unloading       = value[:unloading]
				p.delscheduleid   = value[:delscheduleid]
				p.incscheduleid   = value[:incscheduleid]
				p.buyers_route_id = value[:buyers_route_id].to_i==-1 ? nil : value[:buyers_route_id].to_i
				p.placecategory_id= value[:placecategory_id]
				p.save
				if value[:join].to_i == 1
					main_points << id
				elsif value[:join].to_i == 2	
					add_points << id
				end
			end
			if main_points.size == 1 and add_points.size >= 1
				lst_points = add_points.join(',')
				ActiveRecord::Base.connection.execute("
				update buyers 
				set    placeunload_id = #{main_points[0]}
				where placeunload_id in (#{lst_points});
				delete placeunload where id in (#{lst_points})")
			end
		end
	end
  	redirect_to :action => "index"
  end
  def save_point_r
	if params[:a]
		params[:a].each_pair do |id, value|
			if value[:needsave] == "1"
				p = Placeunload.find( id )
				p.name = value[:pname]
				p.address = value[:srcaddress]
				p.fulladdress = value[:fulladdress]
				p.latitude = value[:latitude]
				p.longitude = value[:longitude]
				p.ischeck = value[:ischeck]
				p.descr   = value[:descr]
				p.save
			end
		end
	end
  	redirect_to :action => "prov"
  end
  def save_route
	if params[:a]
		params[:a].each_pair do |id, value|
			if value[:needsave] == "1"
				p = Placeunload.find( id )
				p.buyers_route_id = value[:buyers_route_id].to_i==-1 ? nil : value[:buyers_route_id].to_i
				p.save
			end
		end
	end
  	redirect_to :action => "index"
  end
  
private
  def set_conditions
  	@longitude = 37.498995
	@latitude  = 55.842610
	@places    = []
	@unloading_list     = [ ['__Не определено', -1], ['15 мин', 15],['30 мин',30],['45 мин',45],['1 час',60],['2 час',120],['4 час',240] ] 
	@placecategory_list = ActiveRecord::Base.connection.select_all( "select id, name from placecategory order by name" ).collect {|p| [ p["name"], p["id"] ] }
	@schedule_list      = ActiveRecord::Base.connection.select_all( "select id, name from schedule order by name" ).collect {|p| [ p["name"], p["id"] ] }
	
	res = Proxycat.connection.select_all("exec placeunload_set_conditions")
	
	@buyers_route_list  = (res.select{|p| p["type"]=="buyers_route_list"}).collect{|p| [ p["name"], p["id"] ]}
	@route_json = ((res.select {|p| p["type"]=="route_json" }).collect{|p| {"id" => p["id"], "name" => p["name"], "points" => p["point"]} }).to_json
  end

end