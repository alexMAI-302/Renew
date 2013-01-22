# encoding: utf-8
class DelordDelMiscController < ApplicationSimpleErrorController
  def index

  end

  def delord_del_misc
    begin
      case request.method.to_s
      when "get"
        data=ActiveRecord::Base.connection.select_all("SELECT id, name FROM delord_del_misc ORDER BY name")
        render :text => data.to_json
      when "post"
        ActiveRecord::Base.connection.execute("
				  INSERT dbo.delord_del_misc (id, name)
				  VALUES (idgenerator('delord_del_misc'), '#{ActiveRecord::Base.connection.quote_string(params[:name])}')")
        render :text => {"success" => true}.to_json
      when "put"
        ActiveRecord::Base.connection.execute("UPDATE dbo.delord_del_misc SET name = '#{ActiveRecord::Base.connection.quote_string(params[:name])}'
				  WHERE id = #{params[:id].to_i}")
        render :text => {"success" => true}.to_json
      when "delete"
        ActiveRecord::Base.connection.execute("DELETE dbo.delord_del_misc WHERE id = #{params[:id].to_i}")
        render :text => {"success" => true}.to_json
      end
    rescue => t
      puts "Error!!! #{t}"
      render :text => {"success" => false, "msg" => "#{t}"}.to_json
    end
  end
end