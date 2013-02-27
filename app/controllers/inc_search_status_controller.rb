# encoding: utf-8
class IncSearchStatusController < ApplicationSimpleErrorController

	def index

	end
	
	def inc_search_status
	begin
		case request.method.to_s
			when "get"
				data=ActiveRecord::Base.connection.select_all("SELECT id, name FROM dbo.inc_search_status ORDER BY name")
				render :text => data.to_json
			when "post"
				id = ActiveRecord::Base.connection.select_value("select dbo.idgenerator('inc_search_status')")
							
				ActiveRecord::Base.connection.execute("
					INSERT dbo.inc_search_status (id, name)
					VALUES (#{id}, '#{ActiveRecord::Base.connection.quote_string(params[:name])}')")
				render :text => {"success" => true, "id" => id}.to_json
			when "put"
				ActiveRecord::Base.connection.execute("UPDATE dbo.inc_search_status SET name = '#{ActiveRecord::Base.connection.quote_string(params[:name])}' WHERE id = #{params[:id].to_i}")
				render :text => {"success" => true}.to_json
			when "delete"
				ActiveRecord::Base.connection.execute("DELETE dbo.inc_search_status WHERE id = #{params[:id].to_i}")
				render :text => {"success" => true}.to_json
		end
		rescue => t
			puts "Error!!! #{t}"
			render :text => {"success" => false, "msg" => "#{t}"}.to_json
		end
	end
end