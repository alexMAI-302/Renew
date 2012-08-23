# encoding: utf-8

class RenewMenuTreeController < ApplicationSimpleErrorController
  def index
  end
  
  def get_main_items
	renew_urls = ActiveRecord::Base.connection.select_all("
	SELECT
		id,
		name
	FROM
		renew_web.renew_url
	WHERE
		url_type_id = (
		SELECT
			id
		FROM
			renew_web.renew_url_type
		WHERE
			name='Главный пункт меню')")
			
	render :text => renew_urls.to_json
  end
  
  def get_items
	renew_urls=ActiveRecord::Base.connection.select_all("
	SELECT
		id,
		name
	FROM
		renew_web.renew_url
	WHERE
		url_type_id = (
		SELECT
			id
		FROM
			renew_web.renew_url_type
		WHERE
			name='Пункт меню')")
			
	render :text => renew_urls.to_json
  end
  
  def sub_items
	case request.method.to_s
		when "get"
		begin
			renew_urls = ActiveRecord::Base.connection.select_all("
			SELECT
				CONVERT(varchar(30), rmt.parent)+'_'+CONVERT(varchar(30), rmt.id) id,
				rmt.parent parent_id,
				rmt.id child_id
			FROM
				renew_web.renew_menu_tree rmt
			WHERE
				rmt.parent=#{params[:parent_id]}")
					
			render :text => renew_urls.to_json
		end
		when "post"
		begin
			ActiveRecord::Base.connection.execute("
			INSERT INTO renew_web.renew_menu_tree(id, parent)
			ON EXISTING SKIP
			VALUES (#{params[:child_id]}, #{params[:parent_id]})")
			render :text => "[]"
		end
		when "put"
		begin
			ActiveRecord::Base.connection.execute("
			INSERT INTO renew_web.renew_menu_tree(id, parent)
			ON EXISTING SKIP
			VALUES (#{params[:child_id]}, #{params[:parent_id]})")
			render :text => "[]"
		end
		when "delete"
		begin
			ActiveRecord::Base.connection.execute("
			DELETE FROM renew_web.renew_menu_tree
			WHERE id=#{params[:child_id]} AND parent=#{params[:parent_id]}")
			
			render :text => "[]"
		end
	end
  end
  
end
