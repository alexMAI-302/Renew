require 'rubygems'
require 'active_record'

class EmpDept < ActiveRecord::Base
	set_table_name "emp_dept"
	#acts_as_tree :order => "name"
	#belongs_to :parent, :class_name => name, :foreign_key => configuration[:foreign_key], :counter_cache => configuration[:counter_cache]
    has_many :children, :class_name => name, :foreign_key => "parent_id", :order => "path"

	def self.json_tree()
		EmpDept.map do | dept, parent_id|
			{:name => dept.name, :id => node.id, :children => json_tree(parent_id).compact } 
		end
	end
	
	#def children
	#	find(:all, :conditions => "parent_id=#{self.parent_id}")
	#end
	def to_node
		 if children.size > 0
			{ "id" => self.id, "name" => self.name, "parent_id" => self.parent_id, "expanded" => false,
			  "children"   => self.children.map { |c| c.to_node }
			}
		else
			{ "id" => self.id, "name" => self.name, "parent_id" => self.parent_id, "leaf" => true
			}
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
