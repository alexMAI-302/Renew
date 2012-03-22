class Proxycat < ActiveRecord::Base
  self.abstract_class = true
  establish_connection("proxycat_#{RAILS_ENV}".to_sym)
end