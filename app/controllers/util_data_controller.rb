# encoding: utf-8

class UtilDataController < ApplicationSimpleErrorController
  def get_menu
    main_subjects=ActiveRecord::Base.connection.select_all("
  	SELECT DISTINCT
  		ru.id,
  		ru.name name,
  		ru.url_pattern url_pattern,
  		ru.sorder
  	FROM
  		(SELECT
  			id,
  			id child_id,
  			name,
  			url_pattern,
  			sorder
  		FROM
  			renew_web.renew_url
  		WHERE
  			url_type_id = (
  				SELECT
  					id
  				FROM
  					renew_web.renew_url_type
  				WHERE
  					name='Пункт меню')
  			AND
  			id NOT IN (
  			SELECT
  				id
  			FROM
  				renew_web.renew_menu_tree)
  		UNION ALL
  		SELECT
  			ru.id,
  			rmt.id child_id,
  			ru.name,
  			ru.url_pattern,
  			ru.sorder
  		FROM
  			renew_web.renew_url ru
  			JOIN renew_web.renew_menu_tree rmt ON rmt.parent=ru.id
  		WHERE
  			url_type_id = (
  			SELECT
  				id
  			FROM
  				renew_web.renew_url_type
  			WHERE
  				name='Главный пункт меню')) ru
  		JOIN renew_web.renew_users_urls ruu ON ru.child_id=ruu.renew_user_url_id
  		JOIN renew_web.renew_users_groups rug ON rug.renew_user_group_id=ruu.renew_user_group_id
  		JOIN renew_web.renew_users rusr ON rusr.id=rug.renew_user_id
  	WHERE
  		rusr.name='#{(!session[:user_id].nil?)?(session[:user_id]):("guest")}' OR rusr.name='guest'
  	ORDER BY
  		sorder
  	")

    child_subjects=ActiveRecord::Base.connection.select_all("
  	SELECT DISTINCT
  		ru.id,
  		ru.parent,
  		ru.name name,
  		ru.url_pattern url_pattern,
  		ru.sorder
  	FROM
  		(SELECT
  			ru_child.id,
  			ru_parent.id parent,
  			ru_child.name,
  			ru_child.url_pattern,
  			ru_child.sorder
  		FROM
  			renew_web.renew_url ru_parent
  			JOIN renew_web.renew_menu_tree rmt ON ru_parent.id=rmt.parent
  			JOIN renew_web.renew_url ru_child ON ru_child.id=rmt.id) ru
  		JOIN renew_web.renew_users_urls ruu ON ru.id=ruu.renew_user_url_id
  		JOIN renew_web.renew_users_groups rug ON rug.renew_user_group_id=ruu.renew_user_group_id
  		JOIN renew_web.renew_users rusr ON rusr.id=rug.renew_user_id
  	WHERE
  		rusr.name='#{(!session[:user_id].nil?)?(session[:user_id]):("guest")}' OR rusr.name='guest'
  	ORDER BY
  		ru.sorder
  	")

    subjects=[]

    main_subjects.each do |main_subject|
      items=[]
      child_subjects.each do |child_subject|
        if child_subject["parent"]==main_subject["id"] then
          items << {
            :text	=> child_subject["name"],
            :href	=> child_subject["url_pattern"],
            :target	=> '_self'
          }
        end
      end

      if items.length>0 then
        subject = {
          :text	=> main_subject["name"],
          :menu	=> {:items => items}
        }
      else
        subject = {
          :text		=> main_subject["name"],
          :href		=> main_subject["url_pattern"],
          :hrefTarget	=> '_self'
        }
      end

      subjects << subject
    end

    render :text => subjects.to_json
  end

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
    sites=ActiveRecord::Base.connection.select_all("
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
    :conditions => "short_name LIKE '%#{ActiveRecord::Base.connection.quote_string(val)}%'" )

    render :json => goods.to_json
  end

  def get_branches
    res=ActiveRecord::Base.connection.select_all("
    SELECT id, name
    FROM branch
    WHERE exists (select * from pps_terminal where isdeleted=0 and main_subdealerid=branch.subdealerid and ttp_id in (4,16))")
    render :text => res.to_json
  end

  def get_subdealers
    subdealers=PpsSubdealer.find(:all,
    :select => "subdealerid id, name",
    :conditions => 'subdealerid in (select main_subdealerid from pps_terminal where isdeleted=0)',
    :order => :name)

    render :text => subdealers.to_json
  end
  
  def get_period
    period = ActiveRecord::Base.connection.select_all("SELECT id, CONVERT(VARCHAR(7), ddateb, 111) name FROM period ORDER BY ddateb DESC")
    render :text => period.to_json
  end
end
