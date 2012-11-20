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
    	when "post"
        File.rename("#{RAILS_ROOT}/public/unact_info/pdf/#{params[:id]}", "#{RAILS_ROOT}/public/unact_info/pdf/#{params[:name]}")
        render :text => {:id => params[:name], :name => params[:name], :size => params[:size]}.to_json
      when "delete"
        File.delete("#{RAILS_ROOT}/public/unact_info/pdf/#{params[:id]}")
        render :text => "[]"
    end
	end
	
	def upload_file
	  begin
	    File.copy_stream(params[:action_data], "#{RAILS_ROOT}/public/unact_info/pdf/#{params[:action_name]}")
	    # f = File.new("#{RAILS_ROOT}/public/unact_info/pdf/#{params[:action_name]}", "w")
	    # logger.info params[:action_data]
			# f.write(params[:action_data])
			# f.close()
			render :text => {"success" => true}.to_json
		rescue => t
		  logger.info t
      render :text => ({"success" => false, "errors" => (t.to_s)}).to_json, :status => 500
    end
	end
end
