# encoding: utf-8
class BrsCommentController < ApplicationSimpleErrorController

	def index

	end
	
	def brs_comment
		begin
			case request.method.to_s
				when "get"
					data=ActiveRecord::Base.connection.select_all("SELECT id, name FROM brs_comment ORDER BY name")
					render :text => data.to_json
				else
					ActiveRecord::Base.connection.execute("exec dbo.prc_brs_comment '#{request.method.to_s}', #{params[:id]}, '#{params[:name]}'")
					render :text => {"success" => true}.to_json
			end
		rescue => t
			puts "Error!!! #{t}"
			render :text => {"success" => false, "msg" => "#{t}"}.to_json
		end
	end
end