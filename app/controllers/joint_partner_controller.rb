# encoding: utf-8
class JointPartnerController < ApplicationSimpleErrorController
  def index
  end
  
  def test
	root = EmpDept.find(:first, :conditions => "parent_id is null")
	logger.info root.to_node.to_json
  end
  
  def partner
	  case request.method.to_s
		when "get"
			inn=(params[:inn].nil?)?('-1'):params[:inn];
			res=ActiveRecord::Base.connection.select_all("
			select
				id,
				name,
				inn
			from
				contractant
			where
				inn like '%#{inn}%'")
			 render :text => res.to_json
    end
	
  end

  def placeunload
    case request.method.to_s
      when "get"
		master_id=(params[:master_id].nil?)?-1:params[:master_id].to_i;
		res=ActiveRecord::Base.connection.select_all("
			exec dbo.ask_joint_partner_points #{master_id}")
			 render :text => res.to_json
     when "post"
	 	rows=ActiveSupport::JSON.decode(request.body.gets)
		items=rows.to_xml(:root => "rows")
		s = "call dbo.prc_joint_partner_save(#{ActiveRecord::Base.connection.quote(items)})"
		r = ActiveRecord::Base.connection.execute(s)
		logger.info(s)
		render :text => {"success" => true}.to_json
     end
  end
  
   def podr_tp
    case request.method.to_s
      when "get"
		podr=(params[:podr].nil?)?-1:params[:podr].to_i;
		res=ActiveRecord::Base.connection.select_all("
			select ps.salesman_id id, ps.name
			from palm_salesman ps
				join partners_groups_tree pgt on pgt.id=ps.srv_pgroup
			where pgt.parent= #{podr} 
			order by ps.name")
			 render :text => res.to_json
     end
  end
  
   def podr_pl
    case request.method.to_s
      when "get"
		podr=(params[:podr].nil?)?-1:params[:podr].to_i;
		res=ActiveRecord::Base.connection.select_all("
			select id, plist, name, podr from dbo.ask_joint_partner_pl()")
			 render :text => res.to_json
     end
  end
   
   def podr
    case request.method.to_s
      when "get"
		res=ActiveRecord::Base.connection.select_all("
			select id,name
			from dbo.ask_renew_podr() t;")
			 render :text => res.to_json
			 logger.info res.to_json
     end
  end

end