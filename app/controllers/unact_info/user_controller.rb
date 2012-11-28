# encoding: utf-8

class UnactInfo::UserController < ApplicationSimpleErrorController
  
  def index
    @actions = ActiveRecord::Base.connection.select_all("SELECT id, name, path FROM renew_web.unact_info")
  end
end
