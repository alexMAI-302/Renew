# encoding: utf-8
require 'nokogiri'

class GoogleLikesController < ApplicationSimpleErrorController
  def index
  end
  
  def likes
    res=ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      title,
      likes,
      ddate
    FROM
      renew_web.google_likes_get('#{Time.parse(params[:ddate]).strftime('%F')}')")
    render :text => res.to_json
  end
  
  def upload_string
    begin
      res=parse_string(params[:data])
      render :text => {"success" => true}.to_json
    rescue => t
      logger.info t
      render :text => ({"success" => false, "errors" => ERB::Util.json_escape(t.to_s)}).to_json, :status => 500
    end
  end

  def upload_file
    begin
      content=params[:data].read(nil)
      
      res=parse_string(content)
      
      render :text => {"success" => true}.to_json
    rescue => t
      logger.info t
      render :text => ({"success" => false, "errors" => ERB::Util.json_escape(t.to_s)}).to_json, :status => 500
    end
  end
  
  private
  def parse_string(content)
    page=Nokogiri::HTML.fragment(content)
    nodes=page.css('div.Tg.Sb')
    
    res=[]
    nodes.each do |node|
      like_txt=node.css('div.qf div.ii div.LI div.rE.Dp.Mj.ml span.le.dI div.G8.ol.le')[0]
      ddate_txt=node.css('div.qf div.ii div.Jst8Q.MI header span.Wp.mc span.Ri.lu a')[0]["title"]
      title_txt=node.css('div.qf div.ii div.ci.gv div.eE.Fp div.wm.VC.Dq2JMd')[0].text
      
      likes = ((like_txt.nil?) ? ('+0') : like_txt.text)
      likes = likes[/\d/].to_i
      
      ddate=Time.parse(ddate_txt).strftime('%F %T')
      
      title=title_txt.strip[0..100]
      
      res << {"google_id" => node["id"], "likes" => likes, "ddate" => ddate, "title" => title}
    end
    
    items=res.to_xml(:root => "actions")
    
    logger.info "
    exec renew_web.google_likes_add(#{ActiveRecord::Base.connection.quote(items)})"
    
    ActiveRecord::Base.connection.execute("
    exec renew_web.google_likes_add(#{ActiveRecord::Base.connection.quote(items)})")
    
  end
end