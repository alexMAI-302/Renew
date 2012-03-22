class RenewUrlType < ActiveRecord::Base
  set_table_name "renew_url_type"
  
  has_many :renew_urls, :class_name => "RenewUrl"
end
