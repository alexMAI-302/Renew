# encoding: utf-8

class WmsQueueController < ApplicationPageErrorController
  
  def wms_queue_entries
    method=request.method.to_s
    case method
    when "get"
      extra_conditions=""
      extra_conditions+="AND request LIKE '%'+#{ActiveRecord::Base.connection.quote(params[:request])}+'%' " if !(params[:request].nil?) && params[:request]!=""
      extra_conditions+="AND reply LIKE '%'+#{ActiveRecord::Base.connection.quote(params[:reply])}+'%' " if !(params[:reply].nil?) && params[:reply]!=""
      extra_conditions+="AND result = #{params[:result].to_i} " if !(params[:result].nil?) && params[:result]!="" && params[:result].to_i!=-2 
      query = "
      SELECT TOP 50
        *
      FROM
        wms_queue
      WHERE
        ts>='#{Time.parse(params[:ddateb]).strftime('%F %T')}'
        AND
        ts< DATEADD(day, 1, '#{Time.parse(params[:ddatee]).strftime('%F %T')}')
        #{extra_conditions}
      ORDER BY
        ts DESC"
        
      res = ActiveRecord::Base.connection.select_all(query)
      render :text => res.to_json
    end
  end
  
  def process_wms_queue_entry
    xid = params[:xid]
    res = nil
    success = false
    if !xid.nil? && xid!=''
      xid=ActiveRecord::Base.connection.quote(xid)
      res = ActiveRecord::Base.connection.select_all("
      BEGIN
        call process_wms_flashback(#{xid});
        SELECT
          *
        FROM
          wms_queue
        WHERE
          xid = #{xid};
      END
      ")
      success=true
    end
    render :text => ((success) ? res.to_json : {:success => false, :responseText => "Не задан xid"}.to_json)
  end
  
  def index
	end
end
  