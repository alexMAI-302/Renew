class PalmSale < ActiveRecord::Base
  set_table_name "palm_sale"
  set_primary_key "sale_id"
  private
    alias original_attributes_with_quotes :attributes_with_quotes

    def attributes_with_quotes(include_primary_key = true, include_readonly_attributes = true)
      quoted = original_attributes_with_quotes(include_primary_key = true, include_readonly_attributes = true)
      quoted.delete('xid')
      quoted
    end
end
