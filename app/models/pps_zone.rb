class PpsZone < ActiveRecord::Base
	set_table_name "pps_zone"
	
	belongs_to :zone_type, :class_name=>'SpValue', :foreign_key => 'spv_id'
	#belongs_to :pps_subdealer, :class_name=>'PpsSubdealer', :foreign_key => 'subdealerid'
end
