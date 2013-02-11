# encoding: utf-8
class ContentEditorController < ApplicationSimpleErrorController  
  def index
  end
  
  def content
    case request.method.to_s
      when "get"
        res=RenewPageContent.find_by_url_part_user(params[:url_id], 1, session[:user_id])
        render :text => res.to_json(:only => [:id, :html, :height])
      when "post"
        id=params[:id]
        if
          !params[:html].nil? &&
          params[:html].strip!="" &&
          params[:html].strip!="<br>"
          if id.to_i>0
            RenewPageContent.update(id, {:html=>params[:html], :height=>params[:height]})
          else
            id=ActiveRecord::Base.connection.select_value("
            BEGIN
              DECLARE @id INT;
              SET @id=idgenerator('renew_web.renew_page_content');
              
              INSERT INTO renew_web.renew_page_content(id, html, height, renew_url_id)
              VALUES(
                @id,
                '#{ActiveRecord::Base.connection.quote_string(params[:html].to_s.gsub("&", "&amp;").gsub("<", "&lt;").gsub(">", "&gt;").gsub("'", "&#39;").gsub('"', "&quot;"))}',
                #{params[:height].to_i},
                #{params[:url_id].to_i});
              SELECT @id;
            END")
          end
        else
          RenewPageContent.delete(id)
          id=nil
        end
        render :text => {"success" => true, "id" => id}.to_json
    end
  end
  
  def get_urls
    menu=RenewUrl.user_menu_subjects(session[:user_id])
    render :text => menu.to_json(:only => [ :id, :name ])
  end
end