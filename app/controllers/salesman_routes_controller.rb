# encoding: utf-8
class SalesmanRoutesController < ApplicationSimpleErrorController
  
  def index
    
  end
  
  def get_palm_units
    palm_units=ActiveRecord::Base.connection.select_all("SELECT
      id,
      name
     FROM
      renew_web.salesman_routes_palm_units_get('#{session[:user_id]}')")
    
    render :text => palm_units.to_json
  end
  
  def get_geo_data
    result=nil
    if !params[:palm_unit_id].nil? && !params[:ddate].nil?
      geo_data=ActiveRecord::Base.connection.select_all("
      SELECT
        simple_id,
        name,
        address,
        buyer_cnt,
        order_cnt,
        order_summ,
        ts,
        latitude,
        longitude,
        level,
        parent_id,
        row_num
       FROM
        renew_web.salesman_routes_geo_data_get(#{params[:palm_unit_id].to_i}, '#{Time.parse(params[:ddate]).strftime('%F')}')")
        
      routes_data=ActiveRecord::Base.connection.select_all("
      SELECT
        ts,
        latitude,
        longitude,
        row_num,
        salesman_id
       FROM
        renew_web.salesman_routes_routes_data_get(#{params[:palm_unit_id].to_i}, '#{Time.parse(params[:ddate]).strftime('%F')}')")
      
      #преобразование таблицы в дерево
      #таблица отсортирована по уровню по возрастанию
      if geo_data!=nil && geo_data.length>1
        #корень
        result=geo_data[0]
        result["expanded"] = true
        result["leaf"] = false
        #массив листов первого уровня - торговые представители
        result["children"]=[]
        #хэш для ускорения работы алгоритма
        salesman_ids={}
        
        #цикл по данным пока идентификатор предка торгового представителя равен идентификатору бригады
        i=1
        while geo_data[i]["parent_id"].to_i==params[:palm_unit_id].to_i && geo_data[i]["level"].to_i==1
          #добавляем номер для определения цвета
          result["children"] << geo_data[i]
          result["children"][i-1]["children"] = []
          result["children"][i-1]["route_str"] = []
          result["children"][i-1]["expanded"] = true
          result["children"][i-1]["leaf"] = false
          salesman_ids[geo_data[i]["simple_id"]] = i-1
          
          i+=1
        end
        
        routes_data.each do |point|
          result["children"][salesman_ids[point["salesman_id"]]]["route_str"] << 
          "{row_num:#{point["row_num"]},latitude:#{point["latitude"]},longitude:#{point["longitude"]},ts:'#{point["ts"]}'}"
        end
        
        result["children"].each do |salesman|
          salesman["route_str"]="[#{salesman["route_str"].join(',')}]"
        end
        
        while i < geo_data.length
          #добавляем признак листа
          result["children"][salesman_ids[geo_data[i]["parent_id"]]]["children"] <<
          geo_data[i].update({
              "leaf" => true,
              "point_str" => "{row_num:#{geo_data[i]["row_num"]},latitude:#{geo_data[i]["latitude"]},longitude:#{geo_data[i]["longitude"]},ts:'#{geo_data[i]["ts"]}'}"
            })
          
          i+=1
        end
      else
        result=geo_data
      end
    end
    
    result = {"children" => [result]}
      
    render :text => result.to_json
  end
  
end
