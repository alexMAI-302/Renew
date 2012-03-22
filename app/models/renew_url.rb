class RenewUrl < ActiveRecord::Base
  set_table_name "renew_url"
  
  belongs_to :renew_url_type, :class_name => "RenewUrlType", :foreign_key => "url_type_id"
end
