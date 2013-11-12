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
      WHERE
        name like '%#{ActiveRecord::Base.connection.quote_string(params[:name])}%'
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
      id = params[:id].to_i
      
      res = ActiveRecord::Base.connection.delete("
      DELETE FROM dbo.union_goods_pictures_link
      WHERE union_goods_id = #{id};
      DELETE FROM dbo.union_goods WHERE id = #{id};")
      
      res = RuzaPicture.connection.delete("
      DELETE FROM dbo.union_goods_pictures
      WHERE id = #{id}")
      
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
	  show_only_without_picture = params[:show_only_without_picture].to_i
    res = ActiveRecord::Base.connection.select_all("
    SELECT
      id,
      short_name name,
      (SELECT list(ug.name)
      FROM dbo.union_goods ug JOIN dbo.cat_goods_in_union cgu ON ug.id=cgu.union_goods_id
      WHERE cgu.cat_goods_id = g.id) union_goods_names,
      IF EXISTS (
        SELECT
          *
        FROM
          union_goods_pictures_link pl
          JOIN union_goods ug ON ug.id = pl.union_goods_id
          JOIN dbo.cat_goods_in_union cgu ON ug.id=cgu.union_goods_id
        WHERE
          g.id = cgu.cat_goods_id
      )
      THEN 1 ELSE 0 END IF has_picture
    FROM
      goods g
    WHERE
      (
        (TRIM('#{val}') <> '' AND g.short_name like '%#{val}%')
        OR
        (TRIM('#{val}')  = '' AND g.id IN (SELECT goods FROM remains))
      )
      AND
      (
        #{show_only_without_picture}<>1
        OR
        (
          #{show_only_without_picture}=1
          AND
          has_picture<>1
        )
      )")
    
    render text: res.to_json
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
       name,
       small_width,
       small_height
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
      id = params[:id].to_i
      
      res = ActiveRecord::Base.connection.delete("
      DELETE FROM dbo.union_goods_pictures_link
      WHERE union_goods_id = #{params[:master_id].to_i} AND union_goods_picture_id = #{id}")
      
      res = RuzaPicture.connection.delete("
      DELETE FROM dbo.union_goods_pictures
      WHERE id = #{id}")
      
      render text: {success: true}.to_json
    end
	end
	
	def get_union_picture_small
    picture = UnionGoodsPicture.find(params[:id])
    
    response.headers['Content-Type'] = picture.content_type
    response.headers['Content-Disposition'] = 'inline'
    render text: picture.small_picture
  end
  
  def get_union_picture_full
    picture = UnionGoodsPicture.find(params[:id])
    
    response.headers['Content-Type'] = picture.content_type
    response.headers['Content-Disposition'] = 'inline'
    render text: picture.full_picture 
  end
  
  def fill_pictures_sizes
    UnionGoodsPicture.find(:all).each do |p|
      full_image = Image.from_blob(p.full_picture)[0]
      small_image = Image.from_blob(p.small_picture)[0]
      
      p.width = full_image.columns
      p.height = full_image.rows
      p.small_width = small_image.columns
      p.small_height = small_image.rows
      
      p.save
    end
    render text: 'ok'
  end
	
	def upload_union_picture
	  begin
	    uploaded = StringIO.new
	    File.copy_stream(params[:image], uploaded)
	    full_image = Image.from_blob(uploaded.string)[0]
	    small_image = full_image.resize_to_fit(256)
	    
	    picture = UnionGoodsPicture.new()
	    picture.name = params[:image].original_filename
	    picture.content_type = params[:image].content_type
	    picture.full_picture = full_image.to_blob
	    picture.small_picture = small_image.to_blob
	    picture.width = full_image.columns
      picture.height = full_image.rows
      picture.small_width = small_image.columns
      picture.small_height = small_image.rows
      
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
  