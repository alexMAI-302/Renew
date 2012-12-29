class Component < ActiveRecord::Base
	set_table_name "component"

	belongs_to :good,
		:class_name=>"Good",
		:foreign_key=>"goods"
		
	has_many   :operations,
		:class_name=>"CompOperation",
		:foreign_key=>"component"
		
	def rst_operations
    rst = connection.select_all( "
    select
      id,
      ddate, 
      source,
      destination,
      terminal,
      person,
      descr,
      IF ddate=(SELECT MAX(t1.ddate) FROM comp_operation t1 WHERE t1.component=#{id}) THEN 1 ELSE 0 END IF can_delete
    from
      comp_operation o
    where
      o.component = #{id}
    order by
      o.ddate desc,
      o.id desc ")
    return rst
  end
  
  def self.rst_terminal  
    rst = connection.select_all("select id, code from osmp_terminal where isold = 0 and code is not null order by 2")
    return rst
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
