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
      ru.name='#{ActiveRecord::Base.connection.quote_string(session[:user_id])}'")
  end

  def get_palm_salesmans
    res=ActiveRecord::Base.connection.select_all(
    "call renew_web.dov_get_agents('#{ActiveRecord::Base.connection.quote_string(session[:user_id])}')")
    render :text => res.to_json
  end

  def create_dov
    ActiveRecord::Base.connection.execute("call dbo.dov_insert(
    '#{ActiveRecord::Base.connection.quote_string(session[:user_id])}',
    #{params[:salesman_id].to_i},
    #{params[:quantity].to_i})")
    render :text => {"success" => true}.to_json
  end

  def get_dov_issue
    res=ActiveRecord::Base.connection.select_all("
    call renew_web.dov_get_dov_issue(#{params[:salesman_id].to_i})")
    render :text => res.to_json
  end

  def get_dov_revoke
    ddateb=Time.parse(params[:ddateb]).strftime('%F')
    ddatee=Time.parse(params[:ddatee]).strftime('%F')
    res=ActiveRecord::Base.connection.select_all("
    SELECT
      d.id,
      a.name salesman_name,
      d.ndoc,
      d.ddate,
      d.status,
      d.unused,
      ru.name renew_user
    FROM
      dov d
      JOIN agents a ON a.id=d.agent
      LEFT JOIN renew_users ru ON ru.id=d.renew_user
    WHERE
      (
        #{params[:salesman_id].to_i}=-1
        OR
        d.agent = #{params[:salesman_id].to_i}
      )
      AND
      (
        #{((params[:show_all_revoke]=='true')? 1 : 0)} = 1
        OR
        status = 0
      )
      AND
      ddate>='#{ddateb}' AND ddate<='#{ddatee}'
      AND
      d.site IN (
      SELECT
        ds.site
      FROM
        renew_web.renew_user_dov_site ds
        JOIN renew_web.renew_users ru1 ON ds.renew_user_id=ru1.id
      WHERE
        ru1.name='#{ActiveRecord::Base.connection.quote_string(session[:user_id])}')
    ORDER BY
      d.ndoc DESC")
    render :text => res.to_json
  end

  def delete_dov
    ActiveRecord::Base.connection.execute("call dbo.dov_delete(
    '#{ActiveRecord::Base.connection.quote_string(session[:user_id])}',
    #{params[:salesman_id].to_i})")
    render :text => {"success" => true}.to_json
  end

  def set_dov_status
    status=params[:status].to_i
    unused=params[:unused].to_i
    ActiveRecord::Base.connection.execute("
    UPDATE dov SET
      status=#{status},
      unused=IF #{unused} = 0 THEN 0 ELSE unused END IF,
      renew_user = (SELECT id FROM renew_users WHERE name = '#{ActiveRecord::Base.connection.quote_string(session[:user_id])}')
    WHERE
      id=#{params[:id].to_i}")
    render :text => {"success" => true, "status" => status, "renew_user" => session[:user_id]}.to_json
  end

  def set_dov_unused
    unused=params[:unused].to_i
    ActiveRecord::Base.connection.execute("
    UPDATE dov SET
      status=IF #{unused} = 1 THEN 1 ELSE status END IF,
      unused=#{unused},
      renew_user = (SELECT id FROM renew_users WHERE name = '#{ActiveRecord::Base.connection.quote_string(session[:user_id])}')
    WHERE
      id=#{params[:id].to_i}")
    render :text => {"success" => true, "unused" => unused, "renew_user" => session[:user_id]}.to_json
  end
end