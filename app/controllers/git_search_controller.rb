# encoding: utf-8
class GitSearchController < ApplicationSimpleErrorController

  def index 
  end
  
  def search
    begin
      case request.method.to_s
        when "get"
          data=ActiveRecord::Base.connection.select_all(
"select distinct
    repo.name  repo,
    files.name name
from
    github.commits
      join github.files on files.commit_id = commits.id
      join github.repo on repo.id = commits.repo
where
    commits.msg like '%#{ActiveRecord::Base.connection.quote_string(params[:searchStr])}%'
order by
    repo.name,
    files.name")
          render :text => data.to_json
        else
          logger.error "Error!!! Нереализованный метод #{request.method.to_s}"
          render :text => {"success" => false, "msg" => "Нереализованный метод #{request.method.to_s}"}.to_json
      end
    rescue => t
      puts "Error!!! #{t}"
      render :text => {"success" => false, "msg" => "#{t}"}.to_json
    end
  end
end