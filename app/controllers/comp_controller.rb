# encoding: utf-8
class CompController < ApplicationSimpleErrorController  
  def index
  end
  
  def components
    case request.method.to_s
      when "get"
        loc_id = params[:comp_location].to_i
        terminal = params[:terminal].to_i
        goods = params[:type].to_i
        
        conditions = []
        if goods>0 
          conditions << "c.goods = #{goods}"
        end
        if params[:serial] and params[:serial].strip.size > 0
          conditions << "c.serial like '%'+" + ActiveRecord::Base.connection.quote(params[:serial]) + "+'%'"
        end
        if terminal > 0
          conditions << "terminal = #{terminal}"
        end
        conditions << (((!params[:comp_location].nil? && params[:comp_location]!='') || loc_id > 0)?( "loc_id = #{loc_id}") : ("loc_id is null"))
        
        top = ''
        swhere = ''
        if conditions.size == 0
          top = 'top 50'
        else
          swhere = 'where ' + conditions.join( ' and ' )
        end
        
        sql = "
        select #{top} 
          c.id id,
          c.goods type,
          c.serial serial,
          isnull(t.loc_id, -1) state,
          t.descr
        from
          component c
          left outer join
          (select
            o.id id,
            o.component component,
            o.destination loc_id,
            o.terminal       terminal,
            o.person         person,
            o.descr          descr
          from
            comp_operation o
          where
            o.id = (select top 1 i.id from comp_operation i where i.component = o.component order by ddate desc, id desc)
          ) t on t.component = c.id
          left outer join  osmp_terminal  ot on ot.id = t.terminal
          left outer join person p on p.person_id = t.person
        #{swhere}
        order by 2,3"
        res = ActiveRecord::Base.connection.select_all(sql)  
        
        render :text => res.to_json
      when "put"
        serial = params[:serial]
        if !check_serial(serial)
          render :text => " Серийный номер #{serial} уже используется! ", :status => 500
          return
        end
      
        Component.find(params[:id]).update_attributes!(
          :goods => params[:type],
          :serial => serial
        )
       
        render :text => {"success" => true, "id" => params[:id]}.to_json
      when "post"
        serial = params[:serial]
        if !check_serial(serial)
          render :text => " Серийный номер #{serial} уже используется! ", :status => 500
          return
        end
        
        c=Component.create(
          :goods => params[:type],
          :serial => serial
        )
        
        ActiveRecord::Base.connection.execute("
        call renew_web.comp_create_operations(
        #{params[:state].to_i},
        null,
        null,
        #{ActiveRecord::Base.connection.quote(params[:descr])},
        '<comp-ids><comp-id><id>#{c.id}</id></comp-id></comp-ids>')")
        
        render :text => {"success" => true, "id" => c.id}.to_json
      when "delete"
        Component.find(params[:id]).destroy if params[:id]
        render :text => {"success" => true}.to_json
    end
  end
  
  def operations
    if !params[:master_id].nil? && params[:master_id].to_i!=0
      case request.method.to_s
        when "get"
          component = Component.find(params[:master_id])
          res = component.rst_operations
          
          render :text => res.to_json
        when "delete"
          CompOperation.find(params[:id]).destroy if params[:id]
          render :text => {"success" => true}.to_json
      end
    else
      render :text => "[]"
    end
  end
  
  def create_operations
    begin
      comp_ids=ActiveSupport::JSON.decode(request.body.gets)["comp_ids"]
      items=comp_ids.to_xml(:root => "comp_ids")
      
      ActiveRecord::Base.connection.execute("
      call renew_web.comp_create_operations(
      #{params[:destination].to_i},
      #{(!params[:person].nil? && params[:person]!='')? params[:person].to_i : 'null'},
      #{(!params[:terminal].nil? && params[:terminal]!='')? params[:terminal].to_i : 'null'},
      #{ActiveRecord::Base.connection.quote(params[:descr])},
      #{ActiveRecord::Base.connection.quote(items)})")
      
      render :text => {"success" => true}.to_json
    rescue ArgumentError => exc
      render :text => " Ошибка ввода: #{exc.message} ", :status => 500
    rescue ActiveRecord::StatementInvalid => exc
      render :text => " Не все обязательные поля заполнены корректно!<br\> Ошибка SQL: #{exc.message} ", :status => 500
    end
  end
  
  def get_types
    res = Good.find(
      :all,
      :select => "id, short_name name",
      :conditions => 'g_group = 3006',
      :order => 'name')
    render :text => res.to_json
  end
  
  def get_comp_locations
    res = CompLocation.find(
      :all,
      :select => "id, name",
      :conditions => "id in (select loc_id from comp_user where name like '#{session[:user_id]}') or not exists( select 1 from comp_user where name like '#{session[:user_id]}' )")
    res << {"id" => -1, "name" => 'н/у'}
    render :text => res.to_json
  end
  
  def get_terminals
    res = Component.rst_terminal.collect {|p| {"id" => p["id"], "name" => p["code"]}}
    render :text => res.to_json
  end
  
  def get_persons
    res = ActiveRecord::Base.connection.select_all("
    SELECT DISTINCT
      p.person_id id,
      p.shortened name
    FROM
      emp_rel r
      join person p on p.person_id = r.person_id
    WHERE
      r.dept_id in (select id from emp_dept where (parent_id = 93 or id in (335,351,405,410,466, 494)))
      and
      (r.ddatee is null or today() between ddateb and ddatee)
    ORDER BY
      2")
    render :text => res.to_json
  end

  def print_operation
  	if params[:id]
  		o = CompOperation.find(params[:id])
  		@cid = o.component
  		@v = ActiveRecord::Base.connection.select_one( "select convert(varchar(10), o.ddate, 103) +  ' ' + convert(varchar(5), o.ddate,114) ddate,
  						p.shortened pname,  s.name sname, d.name dname, t.code tcode, c.serial serial, g.short_name gname, o.descr descr
  	                  from comp_operation o 
  						left outer join comp_location s on s.id = o.source
  						left outer join comp_location d on d.id = o.destination
  						left outer join person p on p.person_id = o.person
  						left outer join osmp_terminal t on t.id = o.terminal
  						join component c on c.id = o.component
  						join goods g on g.id = c.goods
  					  where o.id = #{params[:id].to_i}")
  	end
  end
  
  private
  def check_serial(serial)
    if serial != "бн" #бн
      sql = "select COUNT(*) from component where serial=#{ActiveRecord::Base.connection.quote(serial)} and id <> #{params[:id].to_i}"
      c = ActiveRecord::Base.connection.select_value( sql )
      return (c.to_i<=0)
    else
      return true
    end
  end
end