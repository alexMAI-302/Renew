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
			o.id id,
			convert(varchar(10), o.ddate, 103) +  ' ' + convert(varchar(5), o.ddate,114) ddate, 
		    isnull(s.name,'&nbsp') sname,
			isnull(d.name,'&nbsp') dname,
			isnull(t.code,'&nbsp') tcode,
			isnull(p.shortened,'&nbsp') shortened,
			o.destination destination,
			o.terminal terminal,
			isnull(o.descr, '&nbsp') descr
		from
			comp_operation o
			left outer join comp_location s on o.source = s.id
			left outer join comp_location d on o.destination = d.id
			left outer join person p on o.person = p.person_id 
			left outer join osmp_terminal t on o.terminal = t.id
		where o.component = #{id}
		order by o.ddate desc, o.id desc ")
		return rst
	end
	
	def self.rst_terminal  
		rst = connection.select_all("select id, code from osmp_terminal where isold = 0 and code is not null order by 2")
		return rst
	end
	
end
