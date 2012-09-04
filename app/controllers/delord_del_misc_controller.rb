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
				else
					Proxycat.connection.execute("exec dbo.prc_delord_del_misc '#{request.method.to_s}', #{params[:id]}, '#{params[:name]}'")
					render :text => {"success" => true}.to_json
			end
		rescue => t
			puts "Error!!! #{t}"
			render :text => {"success" => false, "msg" => "#{t}"}.to_json
		end
	end
end