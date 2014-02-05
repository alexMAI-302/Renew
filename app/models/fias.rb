class Fias < ActiveRecord::Base
  self.abstract_class = true
  establish_connection("fias_#{RAILS_ENV}".to_sym)
end