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

  def index
    @placeunload_id = params[:id]
    if params[:flt]
      @placeunload_name = params[:flt][:name].strip
      @address = params[:flt][:address].strip
      @tp = params[:flt][:tp].strip
      @ischeck = params[:flt][:ischeck]
      @buyers_route_id = params[:flt][:buyers_route_id]
      @ddate = params[:flt][:ddate]
      @notgeo = params[:flt][:notgeo]
    end
    @ischeck = -1 unless @ischeck
    @ddate = 0 unless @ddate
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

  def get_placeunloads
    placeunload_name = params[:placeunload_name] ? ActiveRecord::Base.connection.quote_string(params[:placeunload_name]) : ''
    address = params[:address] ? ActiveRecord::Base.connection.quote_string(params[:address]) : ''
    tp = params[:tp] ? ActiveRecord::Base.connection.quote_string(params[:tp]) : ''
    ischeck = params[:ischeck] ? params[:ischeck].to_i : -1
    res = ActiveRecord::Base.connection.select_all("
    call renew_web.placeunload_index(
		#{params[:id].to_i},
		'#{placeunload_name}',
		'#{address}',
		'#{tp}',
		#{ischeck},
		#{params[:buyers_route_id].to_i},
		#{params[:ddate].to_i},
		#{params[:notgeo].to_i})")

    render text: res.to_json
  end

end