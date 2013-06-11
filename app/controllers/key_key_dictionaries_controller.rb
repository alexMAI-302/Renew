# encoding: utf-8
require 'nokogiri'
class KeyKeyDictionariesController < ApplicationSimpleErrorController
  def index
    render :text => 'Словари'
  end
  
  def method_missing(meth, *args, &block)
    meth_name = meth.to_s.slice(/\w*/)
    
    if meth_name =~ /^dictionary_(.+)$/
      create_index_page(meth_name[11..meth_name.length])
    elsif meth_name =~ /^entries_(.+)$/
      dictionary_entries(meth_name[8..meth_name.length], params, request.method.to_s)
    elsif meth_name =~ /^property_table_(.+)$/
      get_properties(meth_name[15..meth_name.length])
    else
      super
    end
  end
  
  def respond_to?(meth)
    meth_name = meth.to_s
    if meth_name =~ /^dictionary_(.+)$/ || meth_name =~ /^entries_(.+)$/ || meth_name =~ /^property_table_(.+)$/
      true
    else
      super
    end
  end
  
  private
  def create_index_page(table_name)
    res = ActiveRecord::Base.connection.select_one("call renew_web.user_dictionaries_get_info('#{table_name}')")
    if res.nil? || res.size!=1
      render :text => "Не найдена таблица или колонки"
    else
      xml_doc  = Nokogiri::XML(res["info"])
      info = xml_doc.root.children
      properties = info[1].children
      
      if properties.length!=2
        render :text => "Не заданы связи #{table_name} с другими таблицами"
      else
        @dictionary = table_name
        @title = info[0].text
        
        @property1_name = properties[0].get_attribute("name")
        @property1_display_name = properties[0].get_attribute("display_name")
        @property1_table = properties[0].get_attribute("table")
        @property2_name = properties[1].get_attribute("name")
        @property2_display_name = properties[1].get_attribute("display_name")
        @property2_table = properties[1].get_attribute("table")
        render :template => "key_key_dictionaries/index"
      end
    end
  end
  
  def dictionary_entries(table_name, params, method)
    table_name=table_name
    property1_name=params[:property1_name]
    property1_name_sym=property1_name.to_sym
    property2_name=params[:property2_name]
    property2_name_sym=property2_name.to_sym
    case method
    when "post"
      property1_value=params[property1_name_sym].to_i
      property2_value=params[property2_name_sym].to_i

      ActiveRecord::Base.connection.insert("INSERT INTO #{table_name}(#{property1_name}, #{property2_name}) VALUES (#{property1_value}, #{property2_value})")

      render :text=>{"id" => "#{property1_value}_#{property2_value}", "success"=>true}.to_json
    when "put"
      strs=params[:id].split("_")
      old_property1_value=strs[0].to_i
      old_property2_value=strs[1].to_i
      
      new_property1_value=params[property1_name_sym].to_i
      new_property2_value=params[property2_name_sym].to_i
      
      ActiveRecord::Base.connection.update("
      UPDATE #{table_name} SET
      #{property1_name} = #{new_property1_value},    #{property2_name} = #{new_property2_value}
      WHERE
      #{property1_name} = #{old_property1_value} AND #{property2_name} = #{old_property2_value}")

      render :text=>{"success"=>true}.to_json
    when "delete"
      strs=params[:id].split("_")
      property1_value=strs[0].to_i
      property2_value=strs[1].to_i
      ActiveRecord::Base.connection.delete("
      DELETE FROM #{table_name}
      WHERE
        #{property1_name}=#{property1_value}
        AND
        #{property2_name}=#{property2_value}")

      render :text=>{"success"=>true}.to_json
    when "get"
      property1_value=params[property1_name_sym].to_i
      property2_value=params[property2_name_sym].to_i
      
      res = ActiveRecord::Base.connection.select_all("
      SELECT
        CONVERT(varchar(32), #{property1_name}) +'_'+ CONVERT(varchar(32), #{property2_name}) id,
        #{property1_name},
        #{property2_name}
      FROM
        #{table_name}
      WHERE
        (-1=#{property1_value} OR #{property1_name}=#{property1_value})
        AND
        (-1=#{property2_value} OR #{property2_name}=#{property2_value})")
      render :text => res.to_json
    end
  end
  
  def get_properties(table_name)
    res=ActiveRecord::Base.connection.select_all("SELECT id, name FROM #{ActiveRecord::Base.connection.quote_string(table_name)} ORDER BY name")
    res.unshift({:id => -1, :name => "ВСЕ"})
    render :text => res.to_json
  end
end
