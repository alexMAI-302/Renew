# encoding: utf-8
class CompController < ApplicationPageErrorController  
  def index
	if params[:post]
		@loc_id = params[:post][:loc_id].to_i
		@terminal = params[:post][:terminal].to_i
	else
		@loc_id = nil
		@terminal = nil
	end
	
	conditions = []
	conditions << ( "g.short_name like '%" + params[:goods] + "%'" ) 	if params[:goods] and params[:goods].strip.size > 0
	conditions << ( "c.serial like '%" + params[:serial] + "%'" ) 		if params[:serial] and params[:serial].strip.size > 0
	conditions << ( "loc_id = #{@loc_id}" ) 							if @loc_id and @loc_id > 0
	conditions << ( "loc_id is null" ) 									if @loc_id and @loc_id < 0
	conditions << ( "terminal = #{@terminal}" ) 						if @terminal and @terminal > 0
	top = ''
	swhere = ''
	if conditions.size == 0
		top = 'top 50'
	else
		swhere = 'where ' + conditions.join( ' and ' )
	end
	
	@cl = CompLocation.find(:all, :conditions => "id in (select loc_id from comp_user where name like '#{session[:user_id]}') or not exists( select 1 from comp_user where name like '#{session[:user_id]}' )").collect {|p| [ p.name, p.id ] }
	@cl << ['н/у',-1]
	@osmp_terminal = Component.rst_terminal.collect {|p| [ p["code"], p["id"] ] }
	sql = "select  #{top}  c.id id, 
			g.short_name type_name,
			c.serial serial,
			if t.id is null then 
				convert(varchar(255),'н/у') 
			else
				(select d.name + if d.id = 3 then ' '+isnull(ot.code,'') else '' endif  + if d.id = 8 then ' '+isnull(p.shortened,'') else '' endif from comp_location d where d.id = loc_id) 
			endif state,
			state,
			t.descr 
			from component c 
			join goods g on g.id = c.goods
			left outer join 
			( select 
				o.id id,
				o.component component,
				o.destination loc_id,
				o.terminal       terminal,
				o.person         person,
				o.descr          descr
			  from
				comp_operation o
			  where o.id = (select top 1 i.id from comp_operation i where i.component = o.component order by ddate desc, id desc)
			) t on t.component = c.id
			left outer join  osmp_terminal  ot on ot.id = t.terminal
			left outer join person p on p.person_id = t.person
			#{swhere} 
			order by 2,3"
	@rst = ActiveRecord::Base.connection.select_all(sql)												
  end
  
  def edit
    @g = Good.find(:all, :conditions => 'g_group = 3006', :order => 'short_name').collect {|g| [ g.short_name, g.id ] }
	@component = Component.find(params[:id]) if params[:id]
	@component = Component.new(params[:component]) if params[:component]
  end
  
  def save_comp
    
	serial = params[:component][:serial]
	unless serial == "бн" #бн
		sql = "select top 1 id from component where serial='#{serial}'"
        sql += " and id <> #{params[:id]} " if params[:id]		
		c = ActiveRecord::Base.connection.select_value( sql )
		if c
			flash[:notice] = " Серийный номер #{serial} уже используется! "
			redirect_to :action => "edit", :id => params[:id], :component => params[:component]
			return
		end
	end
	if params[:id]
		Component.find(params[:id]).update_attributes!(params[:component])
		redirect_to :action => "index" 
	else
		c = Component.create(params[:component])
		redirect_to :action => "list_operations", :id => c.id
	end
  end
  
  def del_comp
	begin
		Component.find(params[:id]).destroy if params[:id]
	rescue ActiveRecord::StatementInvalid => exc
		flash[:notice] = " Нельзя удалить! Есть операции<br\> Ошибка SQL: #{exc.message} "
	end
	redirect_to :action => "index"
  end
  
  def list_operations
	  @component = Component.find(params[:id])
	  @comp_operation = CompOperation.new()
	  @rst = @component.rst_operations
	  if @rst.size > 0
		@comp_operation.source = @rst[0]["destination"]
		@comp_operation.terminal = @rst[0]["terminal"] if @rst[0]["destination"] = 3
	  end
	  @cl = CompLocation.find(:all, :conditions => "id in (select loc_id from comp_user where name like '#{session[:user_id]}') or not exists( select 1 from comp_user where name like '#{session[:user_id]}' )").collect {|p| [ p.name, p.id ] }
	  @osmp_person = ActiveRecord::Base.connection.select_all( "select distinct p.person_id id, p.shortened name 
	                  from emp_rel r join person  p on p.person_id = r.person_id 
					  where r.dept_id in (select id from emp_dept where (parent_id = 93 or id in (335,351,405,410,466, 494))) and (r.ddatee is null or today() between ddateb and ddatee)
                      order by 2").collect {|p| [ p["name"], p["id"] ] }
	  @osmp_terminal = Component.rst_terminal.collect {|p| [ p["code"], p["id"] ] }
  end
  
  def del_operation
	if params[:id]
		o = CompOperation.find(params[:id])
		id = o.component
		o.destroy 
		redirect_to :action => "list_operations", :id => id
	end
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
					  where o.id = #{params[:id]}")
	end
  end
  
  def save_operation
	ho = params[:comp_operation]
	begin
		ho[:ddate] = DateTime.strptime(ho[:ddate], '%d/%m/%Y %H:%M') 
	    ho[:component] = params[:id]
		CompOperation.create(ho)
	rescue ArgumentError => exc
		flash[:notice] = " Ошибка ввода: #{exc.message} "
	rescue ActiveRecord::StatementInvalid => exc
		flash[:notice] = " Не все обязательные поля заполнены корректно!<br\> Ошибка SQL: #{exc.message} "
	end
	redirect_to :action => "list_operations" , :id => params[:id]
  end
end