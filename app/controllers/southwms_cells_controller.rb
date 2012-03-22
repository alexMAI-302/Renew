# encoding: utf-8
class SouthwmsCellsController < ApplicationController
	
	def index
		
	end
	
	def wms_rows
		rows=get_rows
		
		render :text => rows.to_json
	end
	
	def wms_tiers
		row=params[:row]
		
		tiers=get_tiers(row)
		
		render :text => tiers.to_json
	end
	
	def wms_cells
		begin
			if request.method.to_s=="get" then
				row=params[:row]
				row=(!row.nil? && row!="")?row:-1
				tier=params[:tier]
				tier=(!tier.nil? && tier!="")?tier:-1
				
				cells=Southwms.connection.select_all("
				SELECT
					id,
					SUBSTRING(address, 0, first_def_ind) row,
					CONVERT(INT, SUBSTRING(address, first_def_ind+1, second_def_ind-first_def_ind-1)) cell,
					CONVERT(INT, SUBSTRING(
						address,
						second_def_ind+1,
						CASE
							WHEN third_def_ind>0 THEN third_def_ind-1
							ELSE LEN(address)
						END - second_def_ind)) tier,
					SUBSTRING(
						address,
						third_def_ind+1,
						LEN(address)-CASE
							WHEN third_def_ind>0 THEN third_def_ind-1
							ELSE LEN(address)
						END) extra,
					CONVERT(INT, type) type
				FROM
				(SELECT
					id,
					address,
					type,
					CHARINDEX('-', address, 0) first_def_ind,
					CHARINDEX('-', address, CHARINDEX('-', address, 0)+1) second_def_ind,
					CHARINDEX('-', address, CHARINDEX('-', address, CHARINDEX('-', address, 0)+1)+1) third_def_ind
				FROM
					cells
				WHERE
					SUBSTRING(address, 0, CHARINDEX('-', address, 0))=(SELECT name FROM rows WHERE id=#{row})
					OR
					-1=#{row}) inf
				WHERE
					SUBSTRING(
						address,
						second_def_ind+1,
						CASE
							WHEN third_def_ind>0 THEN third_def_ind-1
							ELSE LEN(address)
						END - second_def_ind)='#{tier}'
					OR
					-1=#{tier}
				ORDER BY
					row, cell, tier, extra")

				render :text => cells.to_json
			end
			
			if request.method.to_s=="put" then
				cell=make_cell(params)
				logger.info cell
				Southwms.connection.update("
				UPDATE cells SET address='#{cell["address"]}', type=#{cell["type"]}
				WHERE id=#{cell["id"]}")
				
				render :text=>{"success" => true, "data"=>cell}.to_json
			end
			
			if request.method.to_s=="post" then
				cell=make_cell(params)
				
				cell["id"]=Southwms.connection.insert("
				INSERT INTO cells(address, type)
				VALUES('#{cell["address"]}', #{cell["type"]})")
				
				render :text => [cell].to_json
			end
			
			if request.method.to_s=="delete" then
				Southwms.connection.delete("
				DELETE FROM cells
				WHERE id=#{params[:id]}")
				
				render :text => "[]"
			end
		
		rescue => t
			render :text => {"success" => false, "errors" => "Error!!! #{t}"}.to_json
		end
	end
	
	private
	def make_cell(params)
		cell={}
		cell["id"]=params[:id]
		cell["row"]=Southwms.connection.select_value("SELECT id FROM rows WHERE name='#{params[:row]}'")
		cell["cell"]=params[:cell]
		cell["tier"]=params[:tier]
		cell["extra"]=(!params[:extra].nil? && params[:extra]!='')? ("-#{params[:extra]}") : ""
		cell["type"]=params[:type]
		
		rows=get_rows
		tiers=get_tiers(cell["row"])
		tier_present=false
		tiers.each do |t|
			if t["id"].to_i==cell["tier"].to_i then
				tier_present=true
			end
		end
		
		if cell["row"].nil? then raise 'Ряд не существует' end
		
		if !tier_present then raise 'Ярус не существует' end
		
		if cell["type"]!=0 && cell["type"]!=1 then 'Неверный тип ячейки' end
		
		cell["address"]="#{params[:row]}-#{cell["cell"]}-#{cell["tier"]}#{cell["extra"]}"
		
		cell
	end
	
	private
	def get_rows
		rows=Southwms.connection.select_all("
		SELECT id, name FROM rows ORDER BY name")
	end
	
	private
	def get_tiers(row)
		row=(row)?row:-1
		tiers=Southwms.connection.select_all("
		SELECT
			tier id,
			CONVERT(VARCHAR(10), tier) name
		FROM
			(SELECT DISTINCT
				SUBSTRING(
				address,
				second_def_ind+1,
				CASE
					WHEN third_def_ind>0 THEN third_def_ind-1
					ELSE LEN(address)
				END - second_def_ind) tier
			FROM
				(SELECT
					address,
					CHARINDEX('-', address, CHARINDEX('-', address, 0)+1) second_def_ind,
					CHARINDEX('-', address, CHARINDEX('-', address, CHARINDEX('-', address, 0)+1)+1) third_def_ind
					FROM
						cells
					WHERE
						SUBSTRING(address, 0, CHARINDEX('-', address, 0))=(SELECT name FROM rows WHERE id=#{row})
						OR
						#{row}=-1) inf) t
		ORDER BY
			name")
	end
end
