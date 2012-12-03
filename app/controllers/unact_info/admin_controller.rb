# encoding: utf-8

class UnactInfo::AdminController < ApplicationSimpleErrorController
  
  UNACT_INFO_DIR="#{RAILS_ROOT}/public/unact_info/pdf"
	
	def index
		
	end
	
	def actions
	  case request.method.to_s
	    when "get"
	      res=ActiveRecord::Base.connection.select_all("SELECT id, name, path FROM renew_web.unact_info")
	      
	      res.each do |action|
	        begin
	          action["size"]=File.size("#{UNACT_INFO_DIR}/#{action["path"]}")
	        rescue
	        end
	      end
        
        render :text => res.to_json
    	when "post"
        id=ActiveRecord::Base.connection.select_value("
        BEGIN
          DECLARE @id INT;
          SET @id=idgenerator('renew_web.unact_info');
          INSERT INTO renew_web.unact_info(id, name, path)
          VALUES(@id, #{ActiveRecord::Base.connection.quote(params[:name])}, #{ActiveRecord::Base.connection.quote(params[:path])});
          
          SELECT @id;
        END")
        
        render :text => id
      when "put"
        if params[:path].to_s.contains("/") || params[:path]=="." || params[:path]==".."
          render :text => ({"success" => false, "errors" => "Недопустимое имя файла"}).to_json, :status => 500
        else
          old_path=ActiveRecord::Base.connection.select_value("
          BEGIN
            DECLARE @old_path varchar(8000);
            SET @old_path=(SELECT path FROM renew_web.unact_info WHERE id=#{params[:id].to_i});
            UPDATE renew_web.unact_info SET
              name=#{ActiveRecord::Base.connection.quote(params[:name])},
              path=#{ActiveRecord::Base.connection.quote(params[:path])}
            WHERE id=#{params[:id].to_i};
            SELECT @old_path;
          END")
          File.rename("#{UNACT_INFO_DIR}/#{old_path}", "#{UNACT_INFO_DIR}/#{params[:path]}")
          
          File.chmod(0644, file_name)
          render :text => params[:id]
        end
      when "delete"
        ActiveRecord::Base.connection.delete("DELETE FROM renew_web.unact_info WHERE id=#{params[:id].to_i}")
        File.delete("#{UNACT_INFO_DIR}/#{params[:path]}")
        
        render :text => ""
    end
	end
	
	def upload_file
	  begin
	    path=ActiveRecord::Base.connection.select_value("SELECT path FROM renew_web.unact_info WHERE id=#{params[:action_id].to_i}")
	    file_name="#{UNACT_INFO_DIR}/#{path}"
  	  File.copy_stream(params[:action_data], file_name)
  	  
      File.chmod(0644, file_name)
  	  
  		render :text => {"success" => true}.to_json
		rescue => t
		  logger.info t
      render :text => ({"success" => false, "errors" => ERB::Util.json_escape(t.to_s)}).to_json, :status => 500
    end
	end
end
