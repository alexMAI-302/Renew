# encoding: utf-8

class PpsZone < ActiveRecord::Base
	set_table_name "pps_zone"
	
	belongs_to :zone_type, :class_name=>'SpValue', :foreign_key => 'spv_id'
	#belongs_to :pps_subdealer, :class_name=>'PpsSubdealer', :foreign_key => 'subdealerid'
	
	private

  alias original_attributes_with_quotes :attributes_with_quotes
  def attributes_with_quotes(include_primary_key = true, include_readonly_attributes = true, attribute_names = @attributes.keys)
    quoted = original_attributes_with_quotes(include_primary_key = true, include_readonly_attributes = true, attribute_names = @attributes.keys)
    quoted.delete('xid')
    quoted.delete('ts')
    quoted
  end
end
