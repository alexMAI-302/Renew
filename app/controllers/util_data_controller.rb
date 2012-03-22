class UtilDataController < ApplicationController

	def get_user_info
		user_id = ActiveRecord::Base.connection.select_value("SELECT
			id
		FROM
			agents
		WHERE
			loginname+'@unact.ru'='#{session[:user_id]}'")
		render :text => [{'id' => user_id}, {'name' => session[:user_displayname]}].to_json
	end

	def get_measures
	  measures=Measure.find(:all,
	  :select => "id, name")
	  render :text => measures.to_json
	end
	
	def get_sites
	  sites=Proxycat.connection.select_all("
		SELECT
			id,
			name
		FROM
			site")
	  render :text => sites.to_json
	end
	
	def get_goods
		val=params[:query]
		
		goods=Good.find(:all,
			:select => "id, short_name name",
			:order => "name",
			:limit => params[:limit],
			:conditions => "short_name LIKE '%#{val}%'" )
		puts goods.to_json
		response.charset="utf-8"
		render :json => goods.to_json
	end
end
