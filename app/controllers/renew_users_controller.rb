# encoding: utf-8
class RenewUsersController < ApplicationSimpleErrorController

	def index
	end

	def renew_user
		begin
			case request.method.to_s
				when "get"
					render :text => RenewUser.all(:order => "name").to_json
				when "post"
					renew_user = RenewUser.new("name"=>params[:name])
					renew_user.save
					render :text => {"success" => true, "id" => renew_user.id}.to_json
				when "put"
					renew_user = RenewUser.find(params[:id])
					renew_user.update_attribute('name', params[:name])
					render :text => {"success" => true}.to_json
				when "delete"
				    renew_user = RenewUser.find(params[:id])
					renew_user.destroy
					render :text => {"success" => true}.to_json
				else
					logger.error "Error!!! Неизвестный метод #{request.method.to_s}"
					render :text => {"success" => false, "msg" => "Неизвестный метод #{request.method.to_s}"}.to_json
			end
		rescue => t
			logger.error "Error!!! #{t}"
			render :text => {"success" => false, "msg" => "#{t}"}.to_json
		end
	end

	def renew_group
		begin
			case request.method.to_s
				when "get"
					render :text => RenewUserGroup.all(:order => "name").to_json
				when "post"
					renew_user = RenewUserGroup.new("name"=>params[:name])
					renew_user.save
					render :text => {"success" => true, "id" => renew_user.id}.to_json
				when "put"
					renew_user = RenewUserGroup.find(params[:id])
					renew_user.update_attribute('name', params[:name])
					render :text => {"success" => true}.to_json
				when "delete"
				    renew_user = RenewUserGroup.find(params[:id])
					renew_user.destroy
					render :text => {"success" => true}.to_json
				else
					logger.error "Error!!! Неизвестный метод #{request.method.to_s}"
					render :text => {"success" => false, "msg" => "Неизвестный метод #{request.method.to_s}"}.to_json
			end
		rescue => t
			logger.error "Error!!! #{t}"
			render :text => {"success" => false, "msg" => "#{t}"}.to_json
		end
	end

	def renew_url
		begin
			case request.method.to_s
				when "get"
					render :text => ActiveRecord::Base.connection.select_all("select id, name + ', ' + url_pattern name from renew_web.renew_url order by name").to_json
				else
					logger.error "Error!!! Неизвестный метод #{request.method.to_s}"
					render :text => {"success" => false, "msg" => "Неизвестный метод #{request.method.to_s}"}.to_json
			end
		rescue => t
			logger.error "Error!!! #{t}"
			render :text => {"success" => false, "msg" => "#{t}"}.to_json
		end
	end


	#Функция renew_users_groups вызывается из двух страниц и может менять как renew_user_group_id, так и renew_user_id.
	#для простоты будем в put менять сразу два значения, хотя в один момент меняться может только одна.
	def renew_users_groups
		begin
			case request.method.to_s
				when "get"
					if params[:user_master_id]
						render :text => RenewUsersGroup.find(:all, :conditions => [ "renew_user_id = ?", params[:user_master_id]]).to_json
					else
						if  params[:user_group_master_id]
							render :text => RenewUsersGroup.find(:all, :conditions => [ "renew_user_group_id = ?", params[:user_group_master_id]]).to_json
						else
							msg = "Нет ожидаемого параметра (id группы или id пользователя)"
							logger.error "Error!!! #{msg}"
							render :text => {"success" => false, "msg" => msg}.to_json
						end
					end
				when "post"
					renew_users_groups = RenewUsersGroup.new("renew_user_id" => params[:renew_user_id], "renew_user_group_id" => params[:renew_user_group_id])
					renew_users_groups.save
					render :text => {"success" => true, "id" => renew_users_groups.id}.to_json
				when "put"
					renew_users_groups = RenewUsersGroup.find(params[:id])
					renew_users_groups.update_attribute("renew_user_group_id", params[:renew_user_group_id])
					renew_users_groups.update_attribute("renew_user_id", params[:renew_user_id])
					render :text => {"success" => true}.to_json
				when "delete"
					renew_users_groups = RenewUsersGroup.find(params[:id])
					renew_users_groups.destroy
					render :text => {"success" => true}.to_json
				else
					logger.error "Error!!! Неизвестный метод #{request.method.to_s}"
					render :text => {"success" => false, "msg" => "Неизвестный метод #{request.method.to_s}"}.to_json
			end

		rescue => t
			logger.error "Error!!! #{t}"
			render :text => {"success" => false, "msg" => "#{t}"}.to_json
		end
	end

	def renew_groups_urls
		begin
			case request.method.to_s
				when "get"
					render :text => RenewUsersUrl.find(:all, :conditions => [ "renew_user_group_id = ?", params[:user_group_master_id]]).to_json
				when "post"
					renew_users_url = RenewUsersUrl.new("renew_user_url_id" => params[:renew_user_url_id], "renew_user_group_id" => params[:renew_user_group_id])
					renew_users_url.save
					render :text => {"success" => true, "id" => renew_users_url.id}.to_json
				when "put"
					renew_users_url = RenewUsersUrl.find(params[:id])
					renew_users_url.update_attribute("renew_user_url_id", params[:renew_user_url_id])
					render :text => {"success" => true}.to_json
				when "delete"
					renew_users_url = RenewUsersUrl.find(params[:id])
					renew_users_url.destroy
					render :text => {"success" => true}.to_json
				else
					logger.error "Error!!! Неизвестный метод #{request.method.to_s}"
					render :text => {"success" => false, "msg" => "Неизвестный метод #{request.method.to_s}"}.to_json
			end
		rescue => t
			logger.error "Error!!! #{t}"
			render :text => {"success" => false, "msg" => "#{t}"}.to_json
		end
	end
end