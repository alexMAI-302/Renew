class Geoaddress < ActiveRecord::Base
	set_table_name "geoaddress"
    cattr_reader :per_page
	@@per_page = 6
	def taddress=(ua)
      self[:taddress_old] = ua
    end	
end
