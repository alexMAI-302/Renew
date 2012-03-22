class RenewUsersUrl < ActiveRecord::Base
  belongs_to :renew_user_group, :class_name => "RenewUserGroup"
  belongs_to :renew_user_url, :class_name => "RenewUrl"
end
