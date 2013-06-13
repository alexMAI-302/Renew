# encoding: utf-8
require 'nokogiri'
class KeyValueDictionariesController < ApplicationSimpleErrorController
  def index
    render :text => 'Словари'
  end
  
  def method_missing(meth, *args, &block)
    meth_name = meth.to_s.slice(/\w*/)
    
    if meth_name =~ /^dictionary_(.+)$/
      create_index_page(meth_name[11..meth_name.length])
    elsif meth_name =~ /^entries_(.+)$/
      dictionary_entries(meth_name[8..meth_name.length], params, request.method.to_s)
    else
      super
    end
  end
  
  def respond_to?(meth)
    meth_name = meth.to_s
    if meth_name =~ /^dictionary_(.+)$/ || meth_name =~ /^entries_(.+)$/
      true
    else
      super
    end
  end
  
  private
  def create_index_page(table_name)
    res = ActiveRecord::Base.connection.select_one("
    SELECT
      ISNULL(t.remarks, t.table_name) table_name,
      (SELECT
        ISNULL(c.remarks, 'Наименование') column_name
      FROM
        syscolumn c
      WHERE
        c.table_id = t.table_id AND c.column_name='name') 
    FROM
      systable t
    WHERE
      t.table_name='#{table_name}'")
    if res.nil?
      render :text => "Не найдена таблица"
    else
      @dictionary = table_name
      @title = res["table_name"]
      @property_display_name = res["column_name"]
      
      render :template => "key_value_dictionaries/index"
    end
  end
  
  def dictionary_entries(table_name, params, method)
    table_name=table_name
    case method
    when "post"
      property_value = ActiveRecord::Base.connection.quote_string(params[:name])

      id = ActiveRecord::Base.connection.select_value("
      BEGIN
        DECLARE @id INT;
        DECLARE @user_name VARCHAR(128);
        SET @user_name = (
        SELECT
          user_name
        FROM
          sysuser
        WHERE
          user_id=(
          SELECT
            creator
          FROM
            systable t
          WHERE
            t.table_name='#{table_name}'));
        SET @id=idgenerator('#{table_name}', 'id', @user_name);
        
        INSERT INTO #{table_name}(id, name) VALUES (@id, #{property_value});
        SELECT @id;
      END")

      render :text=>{"id" => id, "success"=>true}.to_json
    when "put"
      id=params[:id].to_i
      
      property_value = ActiveRecord::Base.connection.quote_string(params[:name])
      
      ActiveRecord::Base.connection.update("UPDATE #{table_name} SET name = '#{property_value}' WHERE id = #{id}")

      render :text=>{"success"=>true}.to_json
    when "delete"
      id=params[:id].to_i
      
      ActiveRecord::Base.connection.delete("DELETE FROM #{table_name} WHERE id = #{id}")

      render :text=>{"success"=>true}.to_json
    when "get"
      
      res = ActiveRecord::Base.connection.select_all("
      SELECT
        id,
        name
      FROM
        #{table_name}
      ORDER BY
        name")
      render :text => res.to_json
    end
  end
end
