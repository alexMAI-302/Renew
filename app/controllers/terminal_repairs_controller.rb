# encoding: utf-8
class TerminalRepairsController < ApplicationSimpleErrorController
  def index
  end

  def terminal_repairs
    method=request.method.to_s
    case method
    when "get"
      rs=TerminalRepair.find(:all,
      :select => "id, repair_name, is_tech, is_inc, is_eng",
      :order => "repair_name")

      render :text => rs.to_json
    when "post"
      res = TerminalRepair.new(
      :repair_name=>params[:repair_name],
      :is_tech=>params[:is_tech],
      :is_inc=>params[:is_inc],
      :is_eng=>params[:is_eng]
      )
      res.id = ActiveRecord::Base.connection.select_value("SELECT idgenerator('renew_web.terminal_repairs')")
      res.save
      render :text => {"success" => true, "id" => res.id}.to_json
    when "put"
      id = params[:id].to_i
      TerminalRepair.update(
      id,
      {
        :repair_name=>params[:repair_name],
        :is_tech=>params[:is_tech],
        :is_inc=>params[:is_inc],
        :is_eng=>params[:is_eng]
      })
      render :text => {"success" => true}.to_json
    when "delete"
      id =params[:id].to_i
      TerminalRepair.delete (id);
      render :text => {"success" => true}.to_json
    end
  end
end
