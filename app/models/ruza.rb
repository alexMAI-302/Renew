class Ruza < ActiveRecord::Base
  self.abstract_class = true
  establish_connection("ruza_#{RAILS_ENV}".to_sym)
end