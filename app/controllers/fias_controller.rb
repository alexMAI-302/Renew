# encoding: utf-8
class FiasController < ApplicationSimpleErrorController
  def index

  end
  
	def fias
		case request.method.to_s
			when "get"
        search_str=ActiveRecord::Base.connection.quote(params[:search_str]).to_s
			  
				rst = Fias.connection.select_all("
        SELECT aoguid id, fullname name FROM dbo.fn_search_fias_set(#{search_str})
        ")
        render :text => rst.to_json
#			when "put"
#        id = params[:id].to_i
#        summ = params[:summ].to_f
#        ActiveRecord::Base.connection.update ("UPDATE dbo.subdealer_remains SET summ = #{summ} WHERE id=#{id}")
#        render :text => {"success" => true}.to_json
#			when "delete"
#				render :text => "[]"
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
#     when "put"
#        id = params[:id].to_i
#        summ = params[:summ].to_f
#        ActiveRecord::Base.connection.update ("UPDATE dbo.subdealer_remains SET summ = #{summ} WHERE id=#{id}")
#        render :text => {"success" => true}.to_json
#     when "delete"
#       render :text => "[]"
    end
  end
end