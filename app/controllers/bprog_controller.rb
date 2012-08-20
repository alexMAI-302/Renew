# encoding: utf-8
class BprogController < ApplicationSimpleErrorController

	def index
	end

	def calc
	end

	def test
		if params[:filial_id] and params[:partner_groups_id]
			result = Proxycat.connection.select_all("execute hqsrv12.proxycat.dbo.trigger_calc_bp #{params[:filial_id]}, #{params[:partner_groups_id]}")

			render :text => result.to_json	
		else
			render :text => "Пересчет на запущен. Проверьте, правильно ли заданы параметры.", :status => 500
		end
	end

	def do_bprog
		@rst = Proxycat.connection.select_all('execute hqsrv12.proxycat.dbo.prc_bprog select 1 a')
	end

	def get_filial
		filial=Proxycat.connection.select_all (
			"SELECT
					CAST(filial_status.fid AS VARCHAR(10)) id,
					filial_status.name name
			FROM
					GRS.GRS.dbo.report report
						JOIN GRS.GRS.dbo.report_filial report_filial ON report_filial.id = report.id
						JOIN GRS.GRS.dbo.filial_status filial_status ON filial_status.fid = report_filial.fid
			WHERE
					report.code = 'nbprogram'
			ORDER BY
					filial_status.name")
		filial.unshift({:id => 0, :name => "<Все филиалы>"})
		render :text => filial.to_json
	end

	def get_partner_groups
		partner_groups = Array.new

		if params[:filial_id] and params[:filial_id] != "0"
			partner_groups = Proxycat.connection.select_all ("exec prc_podr #{params[:filial_id]}")
=begin
			partner_groups = Proxycat.connection.select_all (
				"EXEC get_data_filial 
					'SELECT 
							partners_groups.id   id,
							partners_groups.name name
					FROM 
							pref_concept 
								JOIN prefs ON pref_concept.id = prefs.concept AND pref_concept.type = prefs.type
								JOIN partners_groups ON prefs.id = partners_groups.id
					WHERE 
							pref_concept.type = 1 AND 
							pref_concept.name = ''Хр: Партнеры - Подразделение'' AND
							EXISTS
							(
								SELECT 1 
								FROM 
									palm_salesman 
										JOIN partners_groups_tree ON partners_groups_tree.id = palm_salesman.srv_pgroup 
								WHERE 
									partners_groups_tree.parent = partners_groups.id
							)
					ORDER BY
							partners_groups.name',
					#{params[:filial_id]}"
			)
=end
		end

		partner_groups.unshift({:id => 0, :name => "<Все подразделения>"})
		render :text => partner_groups.to_json
	end
end