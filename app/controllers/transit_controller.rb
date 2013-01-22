# encoding: utf-8
require 'spreadsheet'
Spreadsheet.client_encoding = 'UTF-8'

class TransitController < ApplicationSimpleErrorController
	
	def index
		
	end
	
	def get_agents
		begin
			agents=ActiveRecord::Base.connection.select_all("
			SELECT
			a.id,
			a.name
			FROM
			agents a
			JOIN transit_order ON transit_order.agent=a.id
			UNION ALL
			SELECT
			0,
			'Все'
			ORDER BY
			name
			")
			render :text => agents.to_json
		rescue => t
			puts "SOMETHING WRONG!!!! #{t}"
		end
	end
	
	def transit_orders
		if request.method.to_s=="get" then
			ddateb=(params[:ddateb].nil? || params[:ddateb].to_s=='')?('1900-01-01'):params[:ddateb]
			ddatee=(params[:ddatee].nil? || params[:ddatee].to_s=='')?('9999-01-01'):params[:ddatee]
			agent=(params[:agent].nil? || params[:agent]=="")?(0):(params[:agent].to_i)
			transit_orders_list=TransitOrder.find(:all,
				:select => "
				transit_order.id,
				transit_order.agent agent_id,
				transit_order.ddate,
				transit_order.status1,
				transit_order.comments,
				a.name agent_name",
				:joins => "LEFT JOIN agents a",
				:conditions => "transit_order.ddate >= '#{ddateb}' and transit_order.ddate < DATEADD(day, 1, '#{ddatee}')")

			render :text => transit_orders_list.to_json(:only => [:id, :ddate, :agent_id, :agent_name, :status1, :comments])
		end
		
		if request.method.to_s=="put" then
			transit_order=TransitOrder.update(
			  params[:id],
			  {:status1 => (params[:status1])?(1):(0),
			  :comments => params[:comments]})
			
			render :text=>{"success" => true, "data"=>transit_order}.to_json
			# render :text => [{"transit_order" => {
				# :id => transit_order.id,
				# :ddate => transit_order.ddate,
				# :agent_id => transit_order.agent,
				# :agent_name => "",
				# :status1 => transit_order.status1,
				# :comments => transit_order.comments}}].to_json
				#transit_order.to_json(:only => [:id, :ddate, :status1, :comments])
		end
		
		if request.method.to_s=="post" then
				transit_order=TransitOrder.new(
				  :agent => params[:agent_id],
				  :ddate => Time.now,
				  :status1 => (params[:status1])?(1):(0),
				  :comments => params[:comments])
				
				transit_order.id = ActiveRecord::Base.connection.select_value("SELECT idgenerator('transit_order')")
				
				begin
					transit_order.save
				rescue => t
					puts "!?? #{t}"
				end
				render :text => [transit_order].to_json(:only => [:id, :ddate, :status1, :comments])
		end
		
		if request.method.to_s=="delete" then
			TransitOrderGoods.delete_all("transit=#{params[:id]}")
			TransitOrder.delete(params[:id])
			render :text => "[]"
		end
	end
		
	def transit_order_goods
		case request.method.to_s
			when "post"
			begin
				transit_order_goods_rec=TransitOrderGoods.new(
				  :site_from => params[:site_from],
				  :site_to => params[:site_to],
				  :goods => params[:goods_id],
				  :volume => params[:volume],
				  :vmeas => params[:vmeas],
				  :transit => params[:transit_order])
				transit_order_goods_rec.id = ActiveRecord::Base.connection.select_value("SELECT idgenerator('transit_order_goods')")

				begin
					transit_order_goods_rec.save
				rescue => t
					puts "!?? #{t}"
				end
				render :text => transit_order_goods_rec.to_json
			end
			when "put"
			begin
				transit_order_goods_rec=[TransitOrderGoods.update(
				  params[:id],
				  {:site_from => params[:site_from],
				  :site_to => params[:site_to],
				  :goods => params[:goods_id],
				  :volume => params[:volume],
				  :vmeas => params[:vmeas]})]
				render :text => transit_order_goods_rec.to_json
			end
			when "delete"
			begin
				TransitOrderGoods.delete(params[:id])
				render :text => "[]"
			end
			when "get"
			begin
				transit_order_goods_list=ActiveRecord::Base.connection.select_all(
					"SELECT * FROM renew_web.ask_r_transit_order_goods(#{params[:transit_order]})")
					
				render :text => transit_order_goods_list.to_json
			end
		end
	end
	
	def upload_goods_data
		begin
			
			detail_data = params[:detail_data]
			book = Spreadsheet.open detail_data
			sheet=book.worksheet 0
			i=0
			should_read=true
			transitOrderGoods=[]
			vmeas=Measure.find(:first, :select => 'id', :conditions => {:name => 'Короб'})['id']
			
			#если файл только с товарами и количеством, то
			if (true if Float(sheet.row(0)[1]) rescue false) then
				while should_read do
					begin
						if (sheet.row(i)[0].nil?) || (sheet.row(i)[0]=='') ||
						(sheet.row(i)[1].nil?) || (sheet.row(i)[1].to_s=='') then raise StandardError end
						goods_name=sheet.row(i)[0].to_s
						volume=sheet.row(i)[1].to_f
						
						goods=Good.find(
							:first,
							:select => "id, short_name name",
							:conditions => {:short_name => goods_name})
						
						transitOrderGoods_rec={
							"goods_id" => goods["id"],
							"goods_name" => goods["name"],
							"volume" => volume,
							"vmeas" => vmeas
						}
						transitOrderGoods << transitOrderGoods_rec
						i=i+1
					rescue
						should_read=false
					end
				end
			#если файл не только с товарами и количеством, а еще и площадками, то
			else
				sites=ActiveRecord::Base.connection.select_all("
				SELECT
					id,
					name
				FROM
					site")
				site_hash={}
				sites.each do |rec|
					site_hash[rec["name"]] = rec["id"]
				end
				
				while should_read do
					begin
						if (sheet.row(i)[0].nil?) || (sheet.row(i)[0]=='') ||
						(sheet.row(i)[1].nil?) || (sheet.row(i)[1].to_s=='') ||
						(sheet.row(i)[2].nil?) || (sheet.row(i)[2].to_s=='') ||
						(sheet.row(i)[3].nil?) || (sheet.row(i)[3].to_s=='') then raise StandardError end
						
						site_from_name=sheet.row(i)[0].to_s
						site_to_name=sheet.row(i)[1].to_s
						goods_name=sheet.row(i)[2].to_s
						volume=sheet.row(i)[3].to_f
						
						goods=Good.find(
							:first,
							:select => "id, short_name name",
							:conditions => {:short_name => goods_name})
							
						transitOrderGoods_rec={
							"site_from" => site_hash[site_from_name],
							"site_to" => site_hash[site_to_name],
							"goods_id" => goods["id"],
							"goods_name" => goods["name"],
							"volume" => volume,
							"vmeas" => vmeas
						}
						
						transitOrderGoods << transitOrderGoods_rec
						i=i+1
					rescue
						should_read=false
					end
				end
			end
			TransitOrderGoods.delete_all("transit=#{params[:transit_order]}")
			render :text => {"success" => true, "data"=>transitOrderGoods}.to_json
		rescue => t
			puts "Error!!! #{t}"
			render :text => {"success" => false, "errors" => "Error!!! #{t}"}.to_json
		end
	end
end
