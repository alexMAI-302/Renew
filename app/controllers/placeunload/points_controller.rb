# encoding: utf-8
class Placeunload::PointsController < ApplicationPageErrorController

  def find_place
    @longitude = params[:longitude]
    @latitude  = params[:latitude]
    @places = ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      name,
      latitude,
      longitude,
      address,
      fulladdress,
      descr,
      (select
        list(g2.name)
      from
        partners_groups g2
        join partners_groups g1 on g1.parent = g2.id
        join partners p on g1.id = p.parent
        join buyers b on b.partner = p.id
      where
        b.placeunload_id = placeunload.id ) tp
      FROM
        placeunload
      WHERE
        dbo.dist_between_points (latitude, longitude, #{@latitude.to_f}, #{@longitude.to_f}) < getuseroption('renew_dist') order by name" )

    if !params[:remove].nil? then
      @places.delete_if do |r|
        r["id"]==params[:remove].to_i
      end
    end
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

  def index
    set_conditions

    if params[:id]
      @id=params[:id]
      flt='null'
      @flt_name=''
      @flt_address=''
      @flt_tp=''
    @flt_ischeck=-1
    @flt_buyers_route_id=0
    @flt_ddate=0
    @flt_notgeo=0
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
        @flt_notgeo = session[:flt_notgeo] || 0
      end
    end

    init_placeunload_data
  end

  def save_point
    new_xml=""
    if params[:a]
      xml = Builder::XmlMarkup.new(:target => new_xml)

      xml.points do
        params[:a].each_pair do |key, value|
          if value[:needsave].to_i == 1
            xml.point do |p|
              p.id key
              p.name value[:pname]
              p.address value[:srcaddress]
              p.fulladdress value[:fulladdress]
              p.descr value[:descr]
              p.latitude value[:latitude]
              p.longitude value[:longitude]
              p.ischeck value[:ischeck]
              p.unloading value[:unloading]
              p.delscheduleid value[:delscheduleid]
              p.incscheduleid value[:incscheduleid]
              p.buyers_route_id value[:buyers_route_id]
              p.placecategory_id value[:placecategory_id]
              p.join value[:join]
            end
          end
        end
      end
    end

    res=ActiveRecord::Base.connection.select_value("
    SELECT * FROM
    renew_web.placeunload_save_point(#{ActiveRecord::Base.connection.quote(new_xml)}, 0)")

    if !res.nil?
      flash[:notice]=res
    end
    redirect_to :action => "index"
  end

  def save_point_r
    new_xml=""
    if params[:a]
      xml = Builder::XmlMarkup.new(:target => new_xml)

      xml.points do
        params[:a].each_pair do |key, value|
          if value[:needsave].to_i == 1
            xml.point do |p|
              p.id = key
              p.name = value[:pname]
              p.address = value[:srcaddress]
              p.fulladdress = value[:fulladdress]
              p.descr = value[:descr]
              p.latitude = value[:latitude]
              p.longitude = value[:longitude]
              p.ischeck = value[:ischeck]
              p.join = value[:join]
            end
          end
        end

        if params[:b]
          params[:b].each_pair do |key, value|
            if value[:join].to_i == 1
              xml.point do |p|
                p.id = key
                p.join = value[:join]
              end
            end
          end
        end
      end
    end

    res=ActiveRecord::Base.connection.select_value("
    SELECT * FROM
    renew_web.placeunload_save_point(#{ActiveRecord::Base.connection.quote(new_xml)}, 1)")

    if !res.nil?
      flash[:notice]=res
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

    res = ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      name,
      null points,
      'buyers_route_list' type
    FROM
      buyers_route
    UNION ALL
    SELECT
      id,
      name,
      points,
      'route_json'
    FROM
      buyers_route where length(points) > 0
    UNION ALL
    SELECT
      -1,
      '__Не определен',
      null,
      'buyers_route'")

    @buyers_route_list  = (res.select{|p| p["type"]=="buyers_route_list"}).collect{|p| [ p["name"], p["id"] ]}
    @route_json = ((res.select {|p| p["type"]=="route_json" }).collect{|p| {"id" => p["id"], "name" => p["name"], "points" => p["points"]} }).to_json
  end

  def init_placeunload_data
    @rst_buyers=ActiveRecord::Base.connection.select_all("
    call renew_web.placeunload_index(
		#{@id},
		'#{ActiveRecord::Base.connection.quote_string(@flt_name)}',
		'#{ActiveRecord::Base.connection.quote_string(@flt_address)}',
		'#{ActiveRecord::Base.connection.quote_string(@flt_tp)}',
		#{@flt_ischeck},
		#{@flt_buyers_route_id},
		#{@flt_ddate},
		#{@flt_notgeo})")

    @rst_new = @rst_buyers.to_json( :only => [ "id", "longitude", "latitude", "pname" ] )
    if @rst_buyers.size > 0
      if @rst_buyers[0]["longitude"] and @rst_buyers[0]["latitude"]
        @longitude = @rst_buyers[0]["longitude"]
        @latitude  = @rst_buyers[0]["latitude"]
      end
    end
  end

end