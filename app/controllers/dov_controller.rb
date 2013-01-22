# encoding: utf-8
class DovController < ApplicationSimpleErrorController
  def index
    @site=ActiveRecord::Base.connection.select_value("
    SELECT
      ds.site
    FROM
      renew_web.renew_user_dov_site ds
      JOIN renew_web.renew_users ru ON ds.renew_user_id=ru.id
    WHERE
      name=#{ActiveRecord::Base.connection.quote_string(session[:user_id])}")
  end
  
  def get_palm_salesmans
    res=PalmSalesman.find(
      :limit => params[:limit],
      :conditions => [
        "name like '%'+:name+'%' AND site = (SELECT ds.site FROM renew_web.renew_user_dov_site ds JOIN renew_web.renew_users ru ON ds.renew_user_id=ru.id WHERE name=:user_id)",
        {:name => params[:query], :user_id => session[:user_id]}
      ])
    render :text => res.to_json
  end
end