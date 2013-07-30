# encoding: utf-8
class LetterController < ApplicationSimpleErrorController
  def index

  end
  
	def letter
		case request.method.to_s
			when "get"
				rst = ActiveRecord::Base.connection.select_all("
        call dbo.ask_konvert_term_period('#{params[:period].to_i}')")
        render :text => rst.to_json
			when "post"
				render :text => "[]"
			when "put"
				render :text => "[]"
			when "delete"
				render :text => "[]"
		end
	end
end