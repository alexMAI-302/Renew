# encoding: utf-8

class MovementDiffController < ApplicationController

	def movement_diff
		case request.method.to_s
			when "get"
				ddateb=params[:ddateb]
				ddatee=params[:ddatee]
				
				site_from=params[:site_from]
				site_to=params[:site_to]
				
                movement_diff_list = Proxycat.connection.select_all("exec dbo.movement_diff_get
				'#{ddateb}',
				'#{ddatee}',
				#{site_from},
				#{site_to}")
				
				render :text => movement_diff_list.to_json
		end
	end
	
	def clear_diff
		ids=ActiveSupport::JSON.decode(request.body.gets)["ids"]
		new_xml=""
		xml = Builder::XmlMarkup.new(:target => new_xml)

		xml.sale_items do
			ids.each do |i|
				elements=i.split('_')
				xml.item(
					:site_from => elements[0],
					:site_to => elements[1],
					:id => elements[2],
					:subid => elements[3]
				)
			end
		end
		
		logger.info "exec dbo.movement_diff_clear '#{new_xml}'"
		
		Proxycat.connection.execute("exec dbo.movement_diff_clear '#{new_xml}'")
		
		render :text => 'ok'
	end

	def index
	end

end
