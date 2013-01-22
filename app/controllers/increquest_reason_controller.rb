# encoding: utf-8
class IncrequestReasonController < ApplicationSimpleErrorController

	def index

	end
	
	def increquest_reason
		begin
			case request.method.to_s
				when "get"
					data=ActiveRecord::Base.connection.select_all("SELECT id, name FROM increquest_reason ORDER BY name")
					render :text => data.to_json
				when "post"
        ActiveRecord::Base.connection.execute("
          INSERT dbo.increquest_reason (id, name)
          VALUES (idgenerator('increquest_reason'), '#{ActiveRecord::Base.connection.quote_string(params[:name])}')")
        render :text => {"success" => true}.to_json
      when "put"
        ActiveRecord::Base.connection.execute("UPDATE dbo.increquest_reason SET name = '#{ActiveRecord::Base.connection.quote_string(params[:name])}'
          WHERE id = #{params[:id].to_i}")
        render :text => {"success" => true}.to_json
      when "delete"
        ActiveRecord::Base.connection.execute("DELETE dbo.increquest_reason WHERE id = #{params[:id].to_i}")
        render :text => {"success" => true}.to_json
			end
		rescue => t
			puts "Error!!! #{t}"
			render :text => {"success" => false, "msg" => "#{t}"}.to_json
		end
	end
end