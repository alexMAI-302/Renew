# encoding: utf-8
class CompOperation < ActiveRecord::Base
  set_table_name "comp_operation"

  private 
    alias original_attributes_with_quotes :attributes_with_quotes
  def attributes_with_quotes(include_primary_key = true, include_readonly_attributes = true, attribute_names = @attributes.keys)
    quoted = original_attributes_with_quotes(include_primary_key = true, include_readonly_attributes = true, attribute_names = @attributes.keys)
    quoted.delete('xid')
    quoted.delete('ts')   
    quoted
  end
end
