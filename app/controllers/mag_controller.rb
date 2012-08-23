# encoding: utf-8
class MagController < ApplicationPageErrorController
  layout "mag"
  
  before_filter :authorize_mag, :except => :login 
  
  def index
	case params[:chs]
		when '1' then
		    session[:sale_order] ||= []
			redirect_to :action => "sord"
		when '2' then
			create_palm_sale 1
		when '3' then
			create_palm_sale 0
		when '4' then
			redirect_to :action => "list"
		when '5' then
			session[:salesman_id] = nil
			session[:sale_order] = []
			flash[:notice] = " Вы вышли из системы "
			redirect_to :action => "login"
		else
	end
  end

  def list
    salesman_id = session[:salesman_id]
    if request.post? 
		s = params[:chs].to_s.strip
		if  s == '.'
			redirect_to :action => "index"
		elsif /[0-9]+x/ =~ s
			sorow = s.sub('.', '').to_i - 1
		elsif /[0-9]+\./ =~ s
			delrow = s.sub('.', '').to_i - 1
		elsif /[0-9]+/ =~ s
			sorow = s.sub('.', '').to_i - 1
			is_fo = true
		end
	end
	@rst = ActiveRecord::Base.connection.select_all("
	select
		s.ddate ddate,
		sum(isnull(cost,0)) cost,
		s.sale_id sale_id
	from
		palm_sale s
		left outer join palm_saleitemmagaz i on s.sale_id = i.sale_id
	where saleperiod_id in (select saleperiod_id from palm_saleperiod where salesman_id = #{salesman_id} and processed = 0 )
							group by s.ddate, s.sale_id
							order by ddate ")
	if delrow
		if @rst.size > delrow
			sale_id = @rst[delrow]['sale_id']
			palm_sale = PalmSale.find( sale_id )
			if  palm_sale
				@rst.delete_at(delrow)
				palm_sale.destroy
				flash.now[:notice] = " заказ удален "
			end
		end
	end 
	if sorow 
		if @rst.size > sorow
			sale_id = @rst[sorow]['sale_id']
			if is_fo
				print_so_fop sale_id
			else
				print_so sale_id
			end
			flash.now[:notice] = " заказ напечатан "			
		end
	end
end
  
  def sord
	@a = session[:sale_order]
	av = params[:av].to_s.strip
	if av == "."
		redirect_to :action => "index"
	elsif av == ".."
		session[:sale_order] = []
		redirect_to :action => "sord"
	elsif av.from(av.size-1) == "." #удаление позиции
		if av.to(av.size-2).to_i<=@a.size then
			@a.delete_at(av.to(av.size-2).to_i-1)
		else
			flash.now[:notice] = "Нет такой позиции: " + av.to(av.size-2)	
		end
	elsif av.size > 2
	# 4610002740017
	# 5998304241111
	    # Устанавливаем режим. 0 - продажа уцененных товаров, 1 - продажа хороших товаров
		if av[0..0] == session[:mode_symbol]
			mode = 1	
			av = av.from(1)
			pricelist = session[:good_plset]
			storage = session[:good_storage]
		else
			mode = 0
			pricelist = session[:pricelist]
			storage = session[:srv_storage]
		end
		
		sord_goods=ActiveRecord::Base.connection.select_one("
		call renew_web.prc_mag_sord(#{mode}, '#{av}', #{pricelist}, #{storage}, #{session[:salesman_id]})")
		logger.info "call renew_web.prc_mag_sord(#{mode}, '#{av}', #{pricelist}, #{storage}, #{session[:salesman_id]})"
		if sord_goods["info"].nil?
			rem=(sord_goods["v"].to_f).round-get_sum(sord_goods["goods_id"], mode, 0)
			if rem>=1 then
				@a << {:name => sord_goods["goods_name"], :vol => 1, :price => sord_goods["price"].to_f, :goods => sord_goods["goods_id"], :mode => mode, :storage => storage}
			else
				flash.now[:notice] = "Не хватает остатков. Товар ""#{sord_goods["goods_name"]}"", #{(mode==0)?("уцененный"):("нормальный")}."
			end
		else
			flash.now[:notice] = sord_goods["info"]
		end
	elsif av.size > 0 and @a.size > 0
		if @a[-1][:mode] == 0 
			storage = session[:srv_storage]
		else
			storage = session[:good_storage]
		end
		rem=ActiveRecord::Base.connection.select_value( "select get_magaz_rem( #{@a[-1][:goods]},#{session[:salesman_id]},#{storage} ) v" ).to_i - get_sum(@a[-1][:goods],@a[-1][:mode], -1)
		if rem >= av.to_i
			@a[-1][:vol] = av.to_i
		else
			flash.now[:notice] = " Остаток: " + rem.to_s
		end
	elsif av.size > 0
		flash.now[:notice] = "Ошибка" 	
    end
	#params[:av] = ""
  end 

  def login
    session[:salesman_id] = nil
    if request.post? 
	  tabnum = params[:tabnum].to_s
	  session[:tabnum] = tabnum
      if tabnum.size > 5

        palm_salesman = PalmSalesman.find(:first, :conditions => "salesman_id in (
                                                     select m.salesman_id 
													 from employee e join magaz_person m on m.person_id = e.person_id 
													 where convert(varchar(20), 200000  + e.tabnum) = '#{tabnum}' )" )
        if palm_salesman
          session[:salesman_id] = palm_salesman.salesman_id
		  session[:pricelist]   = palm_salesman.srv_pricelist
		  session[:client_id]   = palm_salesman.srv_buyer
		  session[:srv_storage]   = palm_salesman.srv_storage
		  
		  @info = ActiveRecord::Base.connection.select_one( "select salesman_id, mode_symbol, good_storage, good_plset, printer from magaz_info where salesman_id = '#{session[:salesman_id]}'")
		  session[:mode_symbol] = @info['mode_symbol']
		  session[:good_storage] = @info['good_storage'].to_i
		  session[:good_plset] = @info['good_plset'].to_i
		  session[:printer] = @info['printer']

		  redirect_to :action => "index"
        else
          flash.now[:notice] = " нет доступа "
        end
      else
	    s = " следует просканировать пропуск "
        flash.now[:notice] = s
      end
    end
  end
 
private

  def authorize_mag
    unless session[:salesman_id]
      flash[:notice] = " Войдите в систему "
      redirect_to :action => "login"
    end
  end 
  
  def create_palm_sale prt
	a = session[:sale_order]
	puts a
	a.delete_if { |x| x[:vol] == 0 }
	if a.size == 0
		flash.now[:notice] = " no sale with vol > 0 ! "
		return
	end 
	h = {}
	sumtotal = 0
	a.each do |x|
		if h[[x[:goods],x[:storage]]]
			h[[x[:goods],x[:storage]]][1] += x[:vol]
		else
			h[[x[:goods],x[:storage]]] = [x[:price], x[:vol]]
		end
		sumtotal += x[:price] * x[:vol]
	end
	salesman_id = session[:salesman_id]
	saleperiod_id = PalmSale.connection.select_value( "select saleperiod_id from palm_saleperiod 
	                                                   where salesman_id = #{salesman_id} and ddate = today() 
													         and processed = 0" )
	if saleperiod_id														 
		palm_sale = PalmSale.new()
		palm_sale.sale_id = PalmSale.connection.select_value( "select isnull((select max(sale_id) from 
	                                                           palm_sale where intuserid = #{salesman_id}),
															   #{salesman_id}) + 10000 a" )
		palm_sale.saleperiod_id = saleperiod_id
		palm_sale.ddate = Time.now
		palm_sale.client_id = session[:client_id]
		palm_sale.pricelist_id = session[:pricelist]
		palm_sale.sumtotal = sumtotal
		palm_sale.save
		h.each do |r|
			good  = r[0][0]
			storage = r[0][1]
			price = r[1][0]
			vol   = r[1][1]
			item = PalmSaleitemmagaz.new()
			item.sale_id = palm_sale.sale_id
			item.goods_id = good
			item.volume = vol
			item.price = price
			item.storage = storage
			item.cost = vol * price
			item.save
		end
        if prt == 1
          print_so_fop palm_sale.sale_id
        end
		session[:sale_order] = []
		flash.now[:notice] = " заказ обработан "
	else
		flash.now[:notice] = " saleperiod_id not found "
	end
  end


def print_so sale_id
	@rep = PalmSale.connection.select_all("select s.ddate, isnull(g.short_name, c.name) name, i.volume, i.price, i.cost 
			from palm_sale s 
			join palm_saleitemmagaz i on s.sale_id = i.sale_id 
			left outer join goods g on g.id = i.goods_id
			left outer join cutgoods c on c.id = i.goods_id  
			where s.sale_id = #{sale_id}")
	return if not @rep or @rep.size == 0		
	begin
		xl = WIN32OLE.connect('Excel.Application')
	rescue
		xl = WIN32OLE.new('Excel.Application')
	end
	# xl.Visible = 1
	xl.Application.DisplayAlerts = false
	wb = xl.Workbooks.Add
	ws = wb.Worksheets(1)
	ddate = @rep[0]['ddate']
	ws.Cells(1, 1).Value = " Документ от #{ddate} "
	ws.Cells(2, 1).Value = " Товар "
	ws.Cells(2, 2).Value = " \xCAол-во "
	ws.Cells(2, 3).Value = " \xD6ена "
	ws.Cells(2, 4).Value = " Сумма "
	ws.Columns("A:A").ColumnWidth = 35
	s = 0
	@rep.each_with_index do |row, r|
	  ws.Cells(r+3, 1).Value = row['name']
	  ws.Cells(r+3, 2).Value = row['volume'].to_f
	  ws.Cells(r+3, 3).Value = row['price'].to_f
	  ws.Cells(r+3, 4).Value = row['cost'].to_f
	  s += row['cost'].to_f
	end
	l = @rep.size + 3
	ws.Cells(l, 1).Value = " Итого "
	ws.Cells(l, 4).Value = s
	    
    ws.Range("A2:D#{l}").Borders(7).LineStyle = 1
    ws.Range("A2:D#{l}").Borders(8).LineStyle = 1
    ws.Range("A2:D#{l}").Borders(9).LineStyle = 1
    ws.Range("A2:D#{l}").Borders(10).LineStyle = 1
	ws.Range("A2:D#{l}").Borders(11).LineStyle = 1
    ws.Range("A2:D#{l}").Borders(12).LineStyle = 1
	
	wb.PrintOut
	wb.Close
	xl.Quit
	xl = nil
end


def print_so_fop sale_id
	@rep = PalmSale.connection.select_all("select s.ddate, isnull(g.short_name, c.name) name, i.volume, i.price, i.cost 
			from palm_sale s 
			join palm_saleitemmagaz i on s.sale_id = i.sale_id 
			left outer join goods g on g.id = i.goods_id
			left outer join cutgoods c on c.id = i.goods_id  
			where s.sale_id = #{sale_id}")
	return if not @rep or @rep.size == 0
	f = File.open('palm_sale'+session[:tabnum]+'.xml','w')
	#p 'palm_sale'+tabnum+'.xml '
	f.puts "<palm_sale>"
	ddate = @rep[0]['ddate']
	f.puts "<ddate>#{ddate}</ddate>"
	s = 0  
	@rep.each_with_index do |row, r|
	  gname = row['name']
	  gname.gsub!(/\"/,'&quot;')
	  f.puts '<saleitem name="' + gname + '" volume="' + row['volume'].to_s + '" price="' + sprintf('%g', row['price'].to_f) + '" cost="' + sprintf('%g', row['cost'].to_f) + '"/>' 
	  s += row['cost'].to_f
	end
	f.puts "<summ>#{sprintf('%g',s)}</summ>"
	f.puts "</palm_sale>"
	f.close
	puts `/usr/bin/fop -dpi 600 -xml "palm_sale#{session[:tabnum]}.xml" -xsl palm_sale.xsl -pcl "#{session[:tabnum]}.pcl"`
        puts `/usr/bin/smbclient -U=renew_print@unact.ru%jjPBrKR8 #{session[:printer]} -c "print #{session[:tabnum]}.pcl"`

end

def get_sum ( id, mode, flag )
	s = 0
	@a.each_with_index do |r,i|
		puts "s = #{s}"
		s += r[:vol] if ((r[:goods] == id) and (r[:mode] == mode) and ( i != (@a.size-1) or (flag == 0)  ))
	end 
	return s
end

end
