# encoding: utf-8
class BprogController < ApplicationSimpleErrorController

	def calc
	end

	def test
		if params[:filial_id] and params[:partner_groups_id]
			ActiveRecord::Base.connection.execute("trigger event evt_calc_bp (partner_group = #{params[:partner_groups_id]})")

			render :text => {"result" => "Готово"}.to_json	
		else
			render :text => "Пересчет на запущен. Проверьте, правильно ли заданы параметры.", :status => 500
		end
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
		end

		partner_groups.unshift({:id => 0, :name => "<Все подразделения>"})
		render :text => partner_groups.to_json
	end
end