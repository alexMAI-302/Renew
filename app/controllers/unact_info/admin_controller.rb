# encoding: utf-8

class UnactInfo::AdminController < ApplicationSimpleErrorController
	
	def index
		
	end
	
	def actions
	  case request.method.to_s
	    when "get"
    	  file_names=Dir.entries("#{RAILS_ROOT}/public/unact_info/pdf").delete_if {|name| !name.end_with?(".pdf")}
    	  actions=[]
    	  file_names.each do |name|
    	    actions << {"id" => name, "name" => name, "size" => File.size("#{RAILS_ROOT}/public/unact_info/pdf/#{name}")}
    	  end
    	  render :text => actions.to_json
    	when "put"
        File.rename("#{RAILS_ROOT}/public/unact_info/pdf/#{params[:id]}", "#{RAILS_ROOT}/public/unact_info/pdf/#{params[:name]}")
        render :text => {:id => params[:name], :name => params[:name], :size => params[:size]}.to_json
      when "delete"
        #так надо делать, потому что Rails или сервер автоматически выделяет расширение из поля id 
        File.delete("#{RAILS_ROOT}/public/unact_info/pdf/#{params[:id]}")
        render :text => "[]"
    end
	end
	
	def upload_file
	  begin
	    file_name=params[:action_name]
	    
	    if(file_name.ends_with?".pdf")
  	    File.copy_stream(params[:action_data], "#{RAILS_ROOT}/public/unact_info/pdf/#{file_name}")
  	    
  			render :text => {"success" => true}.to_json
  		else
  		  raise 'Файл должен быть в формате pdf'
  		end
		rescue => t
		  logger.info t
      render :text => ({"success" => false, "errors" => ERB::Util.json_escape(t.to_s)}).to_json, :status => 500
    end
	end
end
