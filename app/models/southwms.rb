class Southwms < ActiveRecord::Base
  self.abstract_class = true
  establish_connection("SouthWMS_#{RAILS_ENV}".to_sym)
end