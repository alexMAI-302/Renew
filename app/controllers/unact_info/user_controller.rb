# encoding: utf-8

class UnactInfo::UserController < ApplicationSimpleErrorController
  
  def index
    @actions = Dir.entries("#{RAILS_ROOT}/public/unact_info/pdf").delete_if {|name| !name.end_with?(".pdf")}
  end
end
