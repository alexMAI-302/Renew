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
				else
					Proxycat.connection.execute("exec dbo.prc_increquest_reason '#{request.method.to_s}', #{params[:id]}, '#{params[:name]}'")
					render :text => {"success" => true}.to_json
			end
		rescue => t
			puts "Error!!! #{t}"
			render :text => {"success" => false, "msg" => "#{t}"}.to_json
		end
	end
end