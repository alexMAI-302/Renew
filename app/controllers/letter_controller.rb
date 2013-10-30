# encoding: utf-8
class LetterController < ApplicationSimpleErrorController
  def index

  end
  
	def letter
		case request.method.to_s
			when "get"
				rst = ActiveRecord::Base.connection.select_all("
        call dbo.ask_konvert_term_period('#{params[:period].to_i}')")
        render :text => rst.to_json
#			when "post"
#			render :text => "[]"
			when "put"
        id = params[:id].to_i
        period = params[:period].to_i
        cterm = params[:cterm].to_i
        issue= params[:issue]? 1 : 0
        info = ActiveRecord::Base.connection.quote (params[:info])
        if issue == 1
          id = ActiveRecord::Base.connection.select_value("
            BEGIN
              DECLARE @id INT;
              SET @id = (SELECT TOP 1 id FROM dbo.term_konvert_period WHERE cterm=#{cterm} AND period=#{period});
              IF ISNULL(@id, 0) = 0 THEN
                BEGIN
                  SET @id=idgenerator('dbo.term_konvert_period');
      
                  INSERT INTO dbo.term_konvert_period (id, period, cterm, issue, info)
                  VALUES (@id, #{period}, #{cterm}, #{issue}, #{!info.nil? && info.strip!=''?info : 'null'});
                END;
              ELSE
                BEGIN
                  UPDATE dbo.term_konvert_period SET info=#{info} WHERE  cterm=#{cterm} AND period=#{period};
                END;
              ENDIF;
                
              SELECT @id;
            END;")
          render :text=>{"success"=>true, "id" => id}.to_json
        elsif issue == 0
          ActiveRecord::Base.connection.update ("DELETE FROM dbo.term_konvert_period WHERE cterm=#{cterm} AND period=#{period}")
          info = ''
          render :text => {"success" => true, "info" => info}.to_json
        end
#			when "delete"
#				render :text => "[]"
		end
	end
end