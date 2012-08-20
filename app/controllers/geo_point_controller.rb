class GeoPointController < ApplicationPageErrorController
  
  def index
	@longitude = 30
	@latitude = 50

	set_conditions
	
	@rst_sub = ActiveRecord::Base.connection.select_all( "
	select
		ps.subdealerid id,
		ps.name name,
		g.latitude latitude,
		g.longitude longitude,
		g.city city
	from
		pps_subdealers ps
		join subdealer_geoaddress sg on sg.subdealerid = ps.subdealerid
		join geoaddress g on g.id = sg.geoaddressid
	where ps.subdealerid  in ( select main_subdealerid from pps_terminal)" )
	@subdealers_list = @rst_sub.collect {|p| [ p["name"], p["id"] ] }
	@rst_sub.each do |p|
		if p["id"] == @subdealer
			@longitude = p["longitude"]
			@latitude = p["latitude"]
		end 
	end
	
	ActiveRecord::Base.include_root_in_json = false				
	@rst_new = Geoaddress.find( :all, :from => 'geoaddress_v', :conditions => @str_cond, :order => 'srcaddress'
	                          ).to_json( :only => [ :id, :longitude, :latitude, :pname ]) 

	@city_list = @rst_sub.to_json( :only => "city" )
	refresh_point_list				
  end
  
  def save_point
	if params[:a]
		params[:a].each_pair do |id, value|
			if value[:needsave] == "1"
				g = Geoaddress.find( id )
				g.ismanual = value[:ismanual]
				g.srcaddress = value[:srcaddress]
				g.fulladdress = value[:fulladdress]
				g.latitude = value[:latitude]
				g.longitude = value[:longitude]
				g.taddress = value[:taddress]
				g.save
			end
		end
	end
	set_conditions
	refresh_point_list
  end
  
  def refresh_point
	set_conditions
	refresh_point_list
  end
  
private
  def refresh_point_list
	@addr = Geoaddress.paginate( :from => 'geoaddress_v', :page => params[:page], 
		:order => 'srcaddress', 
		:conditions => @str_cond )
	
	
    respond_to do |format|
		format.html
		format.js {
		  render :update do |page|
			page.replace 'results', :partial => 'point_list'
		  end
		}
    end 
  end

  def set_conditions
	@subdealer = 7
	@pointkind = 1
	@pointname = ""
	@pointaddr = ""
	if params[:post] 
		@subdealer = params[:post][:subdealer].to_i
		session[:subdealer] = @subdealer
		@pointkind = params[:post][:pointkind].to_i
		session[:pointkind] = @pointkind
		@pointname = params[:pointname]  
		session[:pointname] = @pointname
		@pointaddr = params[:pointaddr]
		session[:pointaddr] = @pointaddr
	elsif params[:page]
		@subdealer = session[:subdealer] if session[:subdealer]
		@pointkind = session[:pointkind] if session[:pointkind]
		@pointname = session[:pointname] if session[:pointname]
		@pointaddr = session[:pointaddr] if session[:pointaddr]
	else
		session[:subdealer] = nil
		session[:pointkind] = nil
		session[:pointname] = nil
		session[:pointaddr] = nil
	end
	icw = Iconv.new('WINDOWS-1251','UTF-8')
	@str_cond = " main_subdealerID = #{@subdealer} "

	@str_cond += " and (latitude is not null) " if @pointkind == 3
	@str_cond += " and (latitude is null) " if @pointkind == 1
	@str_cond += " and pname like '%#{@pointname}%' " if @pointname.size > 0
	@str_cond += " and srcaddress like  '%#{@pointaddr}%' " if @pointaddr.size > 0

  end

end
  