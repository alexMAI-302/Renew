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
      name='#{ActiveRecord::Base.connection.quote_string(session[:user_id])}'")
  end

  def get_palm_salesmans
    res=ActiveRecord::Base.connection.select_all(
    "SELECT TOP #{params[:limit].to_i}
      ps.salesman_id id,
      ps.name
    FROM
      palm_salesman ps
    WHERE
      ps.name like '%'+'#{ActiveRecord::Base.connection.quote_string(params[:query])}'+'%'
      AND
      ps.site = (
      SELECT
        ds.site
      FROM
        renew_web.renew_user_dov_site ds
        JOIN renew_web.renew_users ru ON ds.renew_user_id=ru.id
      WHERE
        ru.name='#{ActiveRecord::Base.connection.quote_string(session[:user_id])}')
      ORDER BY
        name")
    render :text => res.to_json
  end

  def create_dov
    ActiveRecord::Base.connection.execute("call dbo.dov_insert(#{params[:salesman_id].to_i}, #{params[:quantity].to_i})")
    render :text => {"success" => true}.to_json
  end

  def get_dov
    res=ActiveRecord::Base.connection.select_all("
    SELECT ndoc id FROM dov WHERE ddate = today() and salesman_id = #{params[:salesman_id].to_i} ORDER BY 1")
    render :text => res.to_json
  end

  def delete_dov
    ActiveRecord::Base.connection.execute("call dbo.dov_delete(#{params[:salesman_id].to_i})")
    render :text => {"success" => true}.to_json
  end
end