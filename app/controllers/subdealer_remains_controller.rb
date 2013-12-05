# encoding: utf-8
class SubdealerRemainsController < ApplicationSimpleErrorController
  def index

  end
  
	def subdealer_remains
		case request.method.to_s
			when "get"
        ddateb=Time.parse(params[:ddateb]).strftime('%F %T')
        ddatee=Time.parse(params[:ddatee]).strftime('%F %T')
			  
			  
				rst = ActiveRecord::Base.connection.select_all("
        SELECT 
            dbo.subdealer_remains.id id, 
            dbo.subdealer_remains.ddate ddate, 
            dbo.subdealer_remains.answer_ddate answer_ddate, 
            dbo.subdealer_remains.summ summ,
            dbo.subdealer.name name
        FROM 
            dbo.subdealer_remains 
                JOIN dbo.subdealer ON dbo.subdealer.src_id = dbo.subdealer_remains.agent
        WHERE 
            dbo.subdealer_remains.ddate BETWEEN '#{ddateb}' AND '#{ddatee}'
        ORDER BY
            dbo.subdealer_remains.ddate DESC,
            dbo.subdealer.name
        ")
        render :text => rst.to_json
			when "put"
        id = params[:id].to_i
        summ = params[:id].to_f
        ActiveRecord::Base.connection.update ("UPDATE dbo.subdealer_remains SET summ = #{summ} WHERE id=#{id}")
        render :text => {"success" => true}.to_json
#			when "delete"
#				render :text => "[]"
		end
	end
end