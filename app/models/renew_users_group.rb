class RenewUsersGroup < ActiveRecord::Base
  belongs_to :renew_user, :class_name => "RenewUser"
  belongs_to :renew_user_group, :class_name => "RenewUserGroup"
end
