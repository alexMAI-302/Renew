class RuzaPicture < ActiveRecord::Base
  self.abstract_class = true
  establish_connection("picture_#{RAILS_ENV}".to_sym)
end