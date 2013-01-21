# encoding: utf-8

class MovementDiffController < ApplicationSimpleErrorController
  def movement_diff
    case request.method.to_s
    when "get"
      ddateb=Time.parse(params[:ddateb]).strftime('%F %T')
      ddatee=Time.parse(params[:ddatee]).strftime('%F %T')

      site_from=params[:site_from].to_i
      site_to=params[:site_to].to_i

      movement_diff_list = ActiveRecord::Base.connection.select_all("
      SELECT
      *
      FROM
        dbo.movement_diff_get(
				'#{ddateb}',
				'#{ddatee}',
				#{site_from},
				#{site_to})")

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
        xml.item do |t|
          t.id elements[2]
          t.subid elements[3]
        end
      end
    end

    logger.info "call dbo.movement_diff_clear(#{ActiveRecord::Base.connection.quote(new_xml)})"

    ActiveRecord::Base.connection.execute("call dbo.movement_diff_clear(#{ActiveRecord::Base.connection.quote(new_xml)})")

    render :text => 'ok'
  end

  def index
  end

end
