# encoding: utf-8
require 'RMagick'
include Magick

class GoodsCatalogController < ApplicationSimpleErrorController

	def index
	end
	
	def union_goods
	  case request.method
    when :get
      res = ActiveRecord::Base.connection.select_all("
      SELECT
        id,
        name
      FROM
        dbo.union_goods
      ORDER BY
        name")
      
      render text: res.to_json
    when :post
      res = ActiveRecord::Base.connection.select_value("
      BEGIN
        DECLARE @id INT;
        SET @id = idgenerator('union_goods');
        
        INSERT INTO dbo.union_goods(id, name)
        VALUES(@id, '#{ActiveRecord::Base.connection.quote_string(params[:name])}');
        
        SELECT @id;
      END")
      
      render :text => { success: true, id: res}.to_json
    when :put
      res = ActiveRecord::Base.connection.select_all("
      UPDATE union_goods
      SET name = '#{ActiveRecord::Base.connection.quote_string(params[:name])}'
      WHERE id=#{params[:id].to_i}")
      
      render :text => { success: true, id: params[:id]}.to_json
    when :delete
      res = ActiveRecord::Base.connection.delete("
      DELETE FROM dbo.union_goods WHERE id = #{params[:id].to_i}")
      render text: {success: true}.to_json
    end
	end
	
	def cat_goods_in_union
    case request.method
    when :get
      res = ActiveRecord::Base.connection.select_all("
      SELECT
        g.id,
        g.short_name name,
        (SELECT list(uc.name)
        FROM dbo.union_goods uc JOIN dbo.cat_goods_in_union cgu ON uc.id=cgu.union_goods_id
        WHERE cgu.cat_goods_id = g.id) union_goods_names
      FROM
        goods g
        JOIN dbo.cat_goods_in_union cgu ON g.id=cgu.cat_goods_id
      WHERE
        cgu.union_goods_id=#{params[:master_id].to_i}")
      
      render text: res.to_json
    when :post
      res = ActiveRecord::Base.connection.select_one("
      BEGIN
        INSERT INTO dbo.cat_goods_in_union(union_goods_id, cat_goods_id)
        ON EXISTING SKIP
        VALUES(#{params[:master_id].to_i}, #{params[:id].to_i});
        
        SELECT
          id,
          short_name name,
          (SELECT list(uc.name)
          FROM dbo.union_goods uc JOIN dbo.cat_goods_in_union cgu ON uc.id=cgu.union_goods_id
          WHERE cgu.cat_goods_id = goods.id) union_goods_names
        FROM
          goods
        WHERE
          id=#{params[:id].to_i}
      END")
      
      res[:success] = true
      
      render text: res.to_json
    when :delete
      res = ActiveRecord::Base.connection.delete("
      DELETE FROM dbo.cat_goods_in_union
      WHERE union_goods_id = #{params[:master_id].to_i} AND cat_goods_id = #{params[:id].to_i}")
      render text: {success: true}.to_json
    end
  end
	
	def get_goods
	  val = ActiveRecord::Base.connection.quote_string(params[:name])
	  if val!=''
	    res = ActiveRecord::Base.connection.select_all("
      SELECT
        id,
        short_name name,
        (SELECT list(uc.name)
        FROM dbo.union_goods uc JOIN dbo.cat_goods_in_union cgu ON uc.id=cgu.union_goods_id
        WHERE cgu.cat_goods_id = g.id) union_goods_names
      FROM
        goods g
      WHERE
        g.short_name like '%#{val}%'")
      
      render text: res.to_json
	  else
	    render text: "[]"
	  end
	end
	
	def union_pictures
	  case request.method
    when :get
      pictures_ids = ActiveRecord::Base.connection.select_all(
      "SELECT union_goods_picture_id FROM union_goods_pictures_link WHERE union_goods_id=#{params[:master_id].to_i}")
      pictures_ids = pictures_ids.collect {|id| id["union_goods_picture_id"]} *','
      
      res = (pictures_ids.nil? || pictures_ids=="")?[]:RuzaPicture.connection.select_all("
      SELECT
       id,
       name
      FROM
       union_goods_pictures
      WHERE
       id IN (#{pictures_ids})")
      
      render text: res.to_json
    when :put
      res = RuzaPicture.connection.update("
      UPDATE union_goods_pictures
      SET name = '#{ActiveRecord::Base.connection.quote_string(params[:name])}'
      WHERE id=#{params[:id].to_i}")
      
      render text: {success: true, name: params[:name], id: params[:id]}.to_json
    when :delete
      res = ActiveRecord::Base.connection.delete("
      DELETE FROM dbo.union_goods_pictures_link
      WHERE union_goods_id = #{params[:master_id].to_i} AND union_goods_picture_id = #{params[:id].to_i}")
      
      res = RuzaPicture.connection.delete("
      DELETE FROM dbo.union_goods_pictures
      WHERE id = #{params[:id].to_i}")
      
      render text: {success: true}.to_json
    end
	end
	
	def get_union_picture_small
    res = RuzaPicture.connection.select_value("
    SELECT small_picture
    FROM union_goods_pictures
    WHERE id = (#{params[:id].to_i})")
    
    render text: res
  end
  
  def get_union_picture_full
    res = RuzaPicture.connection.select_value("
    SELECT full_picture
    FROM union_goods_pictures
    WHERE id = (#{params[:id].to_i})")
    
    render text: res
  end
	
	def upload_union_picture
	  begin
	    uploaded = StringIO.new
	    File.copy_stream(params[:image], uploaded)
	    full_image = Image.from_blob(uploaded.string)[0]
	    small_image = full_image.resize_to_fit(128)
	    
	    picture = UnionGoodsPicture.new()
	    picture.name = params[:image].original_filename
	    picture.full_picture = full_image.to_blob
	    picture.small_picture = small_image.to_blob
      
      if picture.save
        begin
          res = ActiveRecord::Base.connection.insert("
          INSERT INTO dbo.union_goods_pictures_link(union_goods_id, union_goods_picture_id)
          ON EXISTING SKIP
          VALUES(#{params[:master_id].to_i}, #{picture.id})")
          
          render text: {"success" => true}.to_json
        rescue => t
          picture.destroy
        end
      else
        render text: ({"success" => false, "errors" => ERB::Util.json_escape(picture.errors.inspect)}).to_json, status: 500
      end
   rescue => t
     render text: ({"success" => false, "errors" => ERB::Util.json_escape(t.to_s), "params" => params[:image].original_filename}).to_json, status: 500
   end
	end
end
  