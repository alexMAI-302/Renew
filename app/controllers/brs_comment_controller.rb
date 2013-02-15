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
				when "post"
        ActiveRecord::Base.connection.execute("
          INSERT dbo.brs_comment (id, name)
          VALUES (idgenerator('brs_comment'), '#{ActiveRecord::Base.connection.quote_string(params[:name])}')")
        render :text => {"success" => true}.to_json
      when "put"
        ActiveRecord::Base.connection.execute("UPDATE dbo.brs_comment SET name = '#{ActiveRecord::Base.connection.quote_string(params[:name])}'
          WHERE id = #{params[:id].to_i}")
        render :text => {"success" => true}.to_json
      when "delete"
        ActiveRecord::Base.connection.execute("DELETE dbo.brs_comment WHERE id = #{params[:id].to_i}")
        render :text => {"success" => true}.to_json
			end
		rescue => t
			puts "Error!!! #{t}"
			render :text => {"success" => false, "msg" => "#{t}"}.to_json
		end
	end

end