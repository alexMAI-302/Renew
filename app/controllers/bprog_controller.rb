# encoding: utf-8
class BprogController < ApplicationSimpleErrorController

	def calc
	end

	def test
		if params[:partner_groups_id] && params[:bp_id]
 			ActiveRecord::Base.connection.execute("trigger event evt_calc_bp (partner_group = #{params[:partner_groups_id].to_i}, bp = #{params[:bp_id].to_i})")

			render :text => {"result" => "Готово"}.to_json
		else
			render :text => "Пересчет на запущен. Проверьте, правильно ли заданы параметры.", :status => 500
		end
	end

	def get_partner_groups
			partner_groups = ActiveRecord::Base.connection.select_all("
    SELECT
        partners_groups.id   id,
        partners_groups.name name
    FROM
        pref_concept
          JOIN prefs ON pref_concept.id = prefs.concept AND pref_concept.type = prefs.type
          JOIN partners_groups ON prefs.id = partners_groups.id
    WHERE
        pref_concept.type = 1 AND
        pref_concept.name = 'Хр: Партнеры - Подразделение' AND
        EXISTS
        (
          SELECT 1
          FROM
            palm_salesman
              JOIN partners_groups_tree ON partners_groups_tree.id = palm_salesman.srv_pgroup
          WHERE
            partners_groups_tree.parent = partners_groups.id)
    ORDER BY
        name")

		partner_groups.unshift({:id => 0, :name => "<Все подразделения>"})
		render :text => partner_groups.to_json
	end
	
	def get_bp
	  render :text => Bprog.
	                    all(:select => "id, name", :conditions => {:isActive => 1}, :order => "name ASC").
	                    unshift({:id => 0, :name => "<Все БП>"}).
	                    to_json
	end
end