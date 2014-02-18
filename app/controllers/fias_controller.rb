# encoding: utf-8
class FiasController < ApplicationSimpleErrorController
  def index

  end
  
	def fias
		case request.method.to_s
			when "get"
        search_str=ActiveRecord::Base.connection.quote(params[:search_str]).to_s
        aoguid=ActiveRecord::Base.connection.quote(params[:aoguid]).to_s
			  
				rst = Fias.connection.select_all("
        SELECT aoguid id, fullname name FROM dbo.fn_search_fias_set(#{search_str}, #{aoguid})
        ")
        render :text => rst.to_json
		end
	end
  def fias_detail
    case request.method.to_s
      when "get"
        aoguid=ActiveRecord::Base.connection.quote(params[:aoguid]).to_s
        
        rst = Fias.connection.select_all("
        SELECT aoguid, name, shortname, aolevel FROM dbo.fias_to_table(#{aoguid})
        ")
        render :text => rst.to_json
    end
  end
  def partners_groups
    case request.method.to_s
      when "get"

        rst = ActiveRecord::Base.connection.select_all(    
        "
        SELECT 
            pg.id id,
            pg.name name
        FROM
            partners_groups pg
            JOIN
                (
                    pref_concept pc 
                        JOIN prefs p ON pc.id = p.concept AND p.type = 1
                ) ON p.id = pg.id AND pc.name = 'Хр: Партнеры - Торг.предст.'
        WHERE
            pg.name NOT LIKE '%Архив_%' AND
            pg.name LIKE '%'+#{ActiveRecord::Base.connection.quote(params[:pg_search_str].to_s)}+'%'
        ORDER BY
            pg.name
        ")
      end
    render :text => rst.to_json
  end
  def placeunload
    case request.method.to_s
      when "get"
        
        rst = ActiveRecord::Base.connection.select_all("
        SELECT 
            placeunload.id id,
            buyers.name name,
            placeunload.address address,
            placeunload.aoguid aoguid
        FROM
            placeunload 
                JOIN buyers ON placeunload.id = buyers.placeunload_id
                JOIN partners ON partners.id = buyers.partner
                JOIN
                (
                    partners_groups_tree JOIN partners_groups ON partners_groups.id = partners_groups_tree.id
                )
        WHERE
            partners_groups_tree.parent = #{params[:pg]}
        ORDER BY 
            isnull(placeunload.aoguid, '') DESC, buyers.name 
        ")
        render :text => rst.to_json
     when "put"
        id = params[:id].to_i
        aoguid=ActiveRecord::Base.connection.quote(params[:aoguid]).to_s
        ActiveRecord::Base.connection.update ("UPDATE dbo.placeunload SET aoguid = #{aoguid} WHERE id=#{id}")
        render :text => {"success" => true}.to_json

    end
  end
end