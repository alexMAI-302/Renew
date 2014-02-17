# encoding: utf-8
class WifiInfoController < ApplicationSimpleErrorController
  def index
  end

  def wifi_info
    method=request.method.to_s
    case method
    when "get"
      rs = ActiveRecord::Base.connection.select_all("
         SELECT
           id,
           wifi_name,
           psk_key
         FROM
           renew_web.wifi_info")
      render :text => rs.to_json

    end
  end
end
