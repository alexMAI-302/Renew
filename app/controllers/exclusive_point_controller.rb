# encoding: utf-8
class ExclusivePointController < ApplicationSimpleErrorController
  def index
  end
  
  def ask_exclusive_point
    meter = params[:meter].to_i
    
    res = ActiveRecord::Base.connection.select_all("call dbo.ask_exclusive_point(#{meter})")

    render :text => res.to_json
  end
  
  def ask_buyers_by_coord    
    latitude  = params[:latitude].to_f
    longitude = params[:longitude].to_f      
    meter     = params[:meter].to_i
    
    res = ActiveRecord::Base.connection.select_all("call dbo.ask_buyers_by_coord(#{latitude}, #{longitude}, #{meter})")

    render :text => res.to_json
  end
  
  def ask_super_multi
    res = ActiveRecord::Base.connection.select_all("call dbo.ask_super_multi()")

    render :text => res.to_json    
  end
  
  def ask_tp_multi
    res = ActiveRecord::Base.connection.select_all("call dbo.ask_tp_multi()")

    render :text => res.to_json    
  end

  def ask_buyer_multi_archiv
    tp = params[:tp].to_i
    
    if tp == 0
      res = []  
    else
      res = ActiveRecord::Base.connection.select_all("call dbo.ask_buyer_multi_archiv(#{tp})")
    end

    render :text => res.to_json    
  end
  
  def multi_buyer    
    begin
      multiBuyer = params[:buyer_id].to_i
      
      case request.method.to_s
        when "post"
          exclBuyer = params[:exclId].to_i
                    
          res = ActiveRecord::Base.connection.select_all("call dbo.prc_change_gp_at_buyer('post', #{multiBuyer}, #{exclBuyer})")
                    
          render :text => {"success" => true, "id" => multiBuyer}.to_json
        when "delete"
          res = ActiveRecord::Base.connection.select_all("call dbo.prc_change_gp_at_buyer('delete', #{multiBuyer})")
          
          render :text => {"success" => true}.to_json
        else
          logger.error "Error!!! Неизвестный метод #{request.method.to_s}"
          render :text => {"success" => false, "msg" => "Неизвестный метод #{request.method.to_s}"}.to_json
      end
    rescue => t
      logger.error "Error!!! #{t}"
      render :text => {"success" => false, "msg" => "#{t}"}.to_json
    end
    
  end
end