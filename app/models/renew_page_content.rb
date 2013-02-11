# encoding: utf-8
class RenewPageContent < ActiveRecord::Base
  set_table_name "renew_page_content"
  
  belongs_to :renew_url, :class_name => "RenewUrl", :foreign_key => "renew_url_id"
  
  def self.find_by_url_part_user(url_id, page_part_id, user_id)
    if RenewUrl.user_menu_subjects(user_id).select {|s| s["id"]==url_id}
      RenewPageContent.first(
        :conditions => ["renew_url_id=:url_id
        AND
        page_part_id=:page_part_id", {:url_id => url_id, :page_part_id => page_part_id}])
    else
      nil
    end
  end
  
  private 
  alias original_attributes_with_quotes :attributes_with_quotes
  def attributes_with_quotes(include_primary_key = true, include_readonly_attributes = true, attribute_names = @attributes.keys)
    quoted = original_attributes_with_quotes(include_primary_key = true, include_readonly_attributes = true, attribute_names = @attributes.keys)
    quoted.delete('xid')
    quoted.delete('ts')   
    quoted
  end
end
