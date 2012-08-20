# encoding: utf-8
class GeoBuyerController < ApplicationPageErrorController
  
  def index
	@longitude = 37.498995
	@latitude = 55.842610

	set_conditions
	
	@rst_sub = ActiveRecord::Base.connection.select_all( "
	select
		pg.id pg_id,
		pg.name pg_name 
	from
		partners_groups pg
	where
		pg.name like 'Актив%'
		and pg.id in ( SELECT id FROM partners_groups_tree WHERE parent = 1014 ) 
	order by name " )
	@subdealers_list = @rst_sub.collect {|p| [ p["pg_name"], p["pg_id"] ] }

	@rst_buyers = ActiveRecord::Base.connection.select_all("
	select
		b.id id,
		g.id g_id,
		b.name pname,
		b.loadto srcaddress, 
		g.fulladdress fulladdress, 
		g.latitude latitude,
		g.longitude longitude,
		g.ismanual ismanual,
		b.loadto taddress
	from
		buyers b
		join geoaddress g on g.id = b.geoaddressid
		join partners p on p.id = b.partner
	where  p.parent = #{@subdealer} order by b.name") 

	@rst_new = @rst_buyers.to_json( :only => [ "id", "longitude", "latitude", "pname" ] ) 
	if @rst_buyers.size > 0 
		if @rst_buyers[0]["longitude"] and @rst_buyers[0]["latitude"]
			@longitude = @rst_buyers[0]["longitude"]
			@latitude  = @rst_buyers[0]["latitude"]
		end
	end
  end
  
  def save_point
  	if params[:commit] == "Сохранить"
		if params[:a]
			params[:a].each_pair do |id, value|
				if value[:needsave] == "1"
					b = Buyer.find( id )
					b.loadto = value[:srcaddress]
					b.save
					g = Geoaddress.find( b.geoaddressid )
					g.ismanual = value[:ismanual]
					g.srcaddress = value[:srcaddress]
					g.fulladdress = value[:fulladdress]
					g.latitude = value[:latitude]
					g.longitude = value[:longitude]
					g.taddress = value[:srcaddress]
					g.save
				end
			end
		end
  
	end
	redirect_to :action => "index"
  end
 
private

  def set_conditions
	@subdealer = 2626
	if params[:post] 
		@subdealer = params[:post][:subdealer].to_i
		session[:subdealer] = @subdealer
	else
		@subdealer = session[:subdealer] if session[:subdealer]
	end
	
	@str_cond = " pg_id = #{@subdealer} "

  end

end
  