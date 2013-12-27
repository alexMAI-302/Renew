# encoding: utf-8
class TerminalKeyController < ApplicationSimpleErrorController
  def index

  end

  def terminal_key
    case request.method.to_s
    when "get"
        filter_str = ActiveRecord::Base.connection.quote (params[:filter_str]).to_s
        filter_str = !filter_str.nil? ?filter_str.strip : ''
        rst = ActiveRecord::Base.connection.select_all("
            SELECT id id, name name, spv_id spv_id, zoneid zoneid FROM dbo.terminal_key WHERE name LIKE #{filter_str} OR #{filter_str} = '' 
          ")
        render :text => rst.to_json
    when "post"
        id=ActiveRecord::Base.connection.select_value("
        BEGIN
          DECLARE @id INT;
          SET @id=idgenerator('dbo.terminal_key');
          INSERT INTO dbo.terminal_key(id, name, spv_id, zoneid, renew_user)
          VALUES(@id, #{ActiveRecord::Base.connection.quote(params[:name])}, #{params[:spv_id].to_i}, #{params[:zoneid].to_i}, '#{session[:user_id]}');
          
          SELECT @id;
        END")
        render :text => {"success" => true, "id" => id}.to_json
    when "put"
        ActiveRecord::Base.connection.update("
        UPDATE dbo.terminal_key SET
          name=#{ActiveRecord::Base.connection.quote(params[:name])}, spv_id = #{params[:spv_id].to_i}, zoneid = #{params[:zoneid].to_i}, renew_user = '#{session[:user_id]}'
        WHERE id=#{params[:id].to_i}")
        render :text => {"success" => true, "id" => params[:id]}.to_json
    when "delete"
        ActiveRecord::Base.connection.delete("DELETE FROM dbo.terminal_key WHERE id=#{params[:id].to_i}")
        render :text => {"success" => true}.to_json
    end
  end
  
  def terminal_key_log
    case request.method.to_s
    when "get"
      terminal_key_id = ActiveRecord::Base.connection.quote (params[:master_id])
      rst = ActiveRecord::Base.connection.select_all("
          SELECT 
            id id, 
            terminal_key_id terminal_key_id,
            CASE type_op 
             WHEN 1 THEN 'Переименование'
             WHEN 2 THEN 'Перемещение'
             ELSE 'ХЗ'
            END type_op, 
            old_strvalue old_strvalue, 
            new_strvalue new_strvalue, 
            old_intvalue old_intvalue,
            new_intvalue new_intvalue,
            ts ts, 
            renew_user renew_user
          FROM 
            dbo.terminal_key_log 
          WHERE 
            terminal_key_id = #{terminal_key_id}
        ")
      render :text => rst.to_json
    end
  end
  
  def get_key_type
    key_type = ActiveRecord::Base.connection.select_all("
      SELECT id id, name name FROM sp_values WHERE code LIKE 'megaport.%' ORDER BY name
    ")
    render :text => key_type.to_json
  end

  def get_pps_zone
    pps_zone = ActiveRecord::Base.connection.select_all("
      SELECT id id, name name, spv_id spv_id FROM pps_zone ORDER BY name
    ")
    render :text => pps_zone.to_json
  end

end