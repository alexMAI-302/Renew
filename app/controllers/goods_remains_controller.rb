# encoding: utf-8
class GoodsRemainsController < ApplicationPageErrorController

  protect_from_forgery :except => [:autocomplete_goods]
  
  def autocomplete_goods
    goods_str=params[:goods][:name]
	@goods = ActiveRecord::Base.connection.select_all("
	SELECT TOP 40
		g.id id,
		g.code + ' ' + g.short_name name
	FROM
		goods g
	WHERE
		    g.semigoods is null
		and (g.short_name like '%#{goods_str}%' OR g.code like '%#{goods_str}%')
	ORDER BY
		name")
	render :layout => false
  end
  
  def index
		
  end
  
  def show_stat
    flash[:notice]=nil
	goods_id = if params[:goods] && params[:goods][:id] && params[:goods][:id] != "" then params[:goods][:id].to_i else 0 end
	
	@goods = ActiveRecord::Base.connection.select_all("
	SELECT
		g.id,
		g.code + ' ' + g.short_name name
	FROM
		goods g
	WHERE
		    g.semigoods is null
		and g.id = #{goods_id}")
	@selected_goods=@goods[0]
	if @selected_goods.nil? then
	  flash[:notice]="Не выбран товар!"
	else
      @goods_remains=Proxycat.connection.select_all(
	  "exec dbo.ask_goods_remains @goods=#{@selected_goods['id']}")
	end
	
	render :action => 'index'
  end
  
end