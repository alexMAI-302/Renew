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
			inn=(params[:inn].nil?)?(''):ActiveRecord::Base.connection.quote(params[:inn]);
			name=(params[:name].nil?)?(''):ActiveRecord::Base.connection.quote(params[:name]);
			res=ActiveRecord::Base.connection.select_all("
			select
				id,
				name,
				inn
			from
				contractant
			where
				inn like '%'+#{inn}+'%' and name like '%'+#{name}+'%'")
			 render :text => res.to_json
    end
	
  end

  def tp
    case request.method.to_s
      when "get"
		master_id=(params[:master_id].nil?)?-1:params[:master_id].to_i;
		res=ActiveRecord::Base.connection.select_all("
			exec dbo.ask_joint_partner_tp #{master_id}")
			 render :text => res.to_json
     when "post"
	 	rows=ActiveSupport::JSON.decode(request.body.gets)
		items=rows.to_xml(:root => "rows")
		s = "call dbo.prc_joint_partner_tp_save(#{ActiveRecord::Base.connection.quote(items)})"
		r = ActiveRecord::Base.connection.execute(s)
		logger.info(s)
		render :text => {"success" => true}.to_json
     end
  end
  
   def podr_tp
    case request.method.to_s
      when "get"
		res=ActiveRecord::Base.connection.select_all("call dbo.ask_joint_partner_podr_tp()")
		render :text => res.to_json
     end
  end
  
   def pricelistCombo
    case request.method.to_s
      when "get"
	    res=ActiveRecord::Base.connection.select_all("
			select pl.id, psplink.id psplink,pl.name, psplink.plset plset
			from psplink
			join pricelist pl on psplink.plist=pl.id")
		 render :text => res.to_json
     end
  end
  
  def pricelist
    case request.method.to_s
      when "get"
		podr =(params[:podr].nil?)?-1:params[:podr].to_i;
		placeunload=(params[:placeunload].nil?)?-1:params[:placeunload].to_i;
		res=ActiveRecord::Base.connection.select_all("
			call dbo.ask_joint_partner_pricelist(#{podr},#{placeunload})")
			 render :text => res.to_json
	when "post"
	 	rows=ActiveSupport::JSON.decode(request.body.gets)
		items=rows.to_xml(:root => "rows")
		s = "call dbo.prc_joint_partner_pl_save(#{ActiveRecord::Base.connection.quote(items)})"
		r = ActiveRecord::Base.connection.execute(s)
		logger.info(s)
		render :text => {"success" => true}.to_json
		
     end
  end
  

  def placeunload
    case request.method.to_s
      when "get"
		contractant =(params[:contractant].nil?)?-1:params[:contractant].to_i;
		res=ActiveRecord::Base.connection.select_all("call dbo.ask_joint_partner_placeunload(#{contractant})")
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