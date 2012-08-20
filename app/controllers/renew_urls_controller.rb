# encoding: utf-8

class RenewUrlsController < ApplicationPageErrorController
  def index
    set_conditions
    set_order

    if params[:field] && params[:order]
      order_by = params[:field] + " " + params[:order]
    else
      order_by = "name ASC"
    end

    @renew_urls = RenewUrl.all(:order => order_by,
                               :conditions => ["(url_type_id = :type or :type = 0)",
                                               {:type => @selected_url_type}])

    @renew_url = RenewUrl.new
    @renew_url_types = RenewUrlType.all(:order => "name")
  end

  def save
	params[:renew_urls].each_key do |id|
		@renew_url = RenewUrl.find(id)
		@renew_url.update_attributes(
		{'name'=>params[:renew_urls][id][:name],
		'url_pattern'=>params[:renew_urls][id][:pattern],
		'url_type_id'=>params[:renew_urls][id][:type],
		'sorder'=>params[:renew_urls][id][:sorder]})
	end
	redirect_to :action => 'index'
  end
  
  def create
    @renew_url = RenewUrl.new(
		'name'=>params[:renew_url][:name],
		'url_pattern'=>params[:renew_url][:pattern],
		'url_type_id'=>params[:renew_url][:type],
		'sorder'=>params[:renew_url][:sorder])
	if @renew_url.save
		redirect_to :action => 'index'
	end
  end

  def destroy
    @renew_url = RenewUrl.find(params[:id])
    @renew_url.destroy

    redirect_to :action => 'index'
  end
  
private
  
  def set_conditions
    if params[:renew_url_types]
      @selected_url_type = params[:renew_url_types].to_i
      session[:renew_url_types] = @selected_url_type
    else
      if session[:renew_url_types]
        @selected_url_type = session[:renew_url_types].to_i
      else
        @selected_url_type = RenewUrlType.first(:order => "name").id
      end
    end
  end

  #@sort_order:
  #  Хэш содержит направления сортировок для каждого сортируемого поля. 
  #  Если таблица отсортирована по какому-то полю, то в хэше направление поменяется на противоположное.
  #@sign_order
  #  Хэш либо пуст либо содержит одну пару значений.
  #  Содержимое - {<отсортированнок поле> => <символ направления сортировки>}
  def set_order
    @sort_order = {"name" => "ASC", "sorder" => "ASC"}
    @sign_order = {} 
    sign = {"ASC" => "&#x25B4;", "DESC" => "&#x25BE;"}

    if params[:field] && params[:order]
      @sort_order[params[:field]] = ["ASC", "DESC"].delete_if{|item| item == params[:order]}.first
      @sign_order = {params[:field] => sign[params[:order]]}
    end
  end
end
