# encoding: utf-8
class LetterController < ApplicationSimpleErrorController
  def index

  end

  def letter
    case request.method.to_s
    when "get"
      prefix = ActiveRecord::Base.connection.quote (params[:prefix]).to_s
      rst = ActiveRecord::Base.connection.select_all("
        call dbo.ask_konvert_term_period(#{params[:period].to_i}, #{prefix})")
      render :text => rst.to_json
    #			when "post"
    #			render :text => "[]"
    when "put"
      id = params[:id].to_i
      period = params[:period].to_i
      cterm = params[:cterm].to_i
      issue= params[:issue]? 1 : 0
      info = ActiveRecord::Base.connection.quote (params[:info])
      issued= params[:issued]? 1 : 0
      info_issued = ActiveRecord::Base.connection.quote (params[:info_issued])

      if issue == 1
        logger.info("
            BEGIN
              DECLARE @id INT;
              SET @id = (SELECT TOP 1 id FROM dbo.term_konvert_period WHERE cterm=#{cterm} AND period=#{period});
              IF ISNULL(@id, 0) = 0 THEN
                BEGIN
                  SET @id=idgenerator('dbo.term_konvert_period');

                  INSERT INTO dbo.term_konvert_period (id, period, cterm, issue, info, issued, info_issued)
                  VALUES (@id, #{period}, #{cterm}, #{issue}, #{!info.nil? && info.strip!=''?info : 'null'}, #{issued}, #{!info_issued.nil? && info_issued.strip!=''?info_issued : 'null'});
                END;
              ELSE
                BEGIN
                  UPDATE dbo.term_konvert_period SET info=#{info}, issued=#{issued}, info_issued=#{info_issued} WHERE  cterm=#{cterm} AND period=#{period};
                END;
              ENDIF;

              SELECT @id;
            END;")
        id = ActiveRecord::Base.connection.select_value("
            BEGIN
              DECLARE @id INT;
              SET @id = (SELECT TOP 1 id FROM dbo.term_konvert_period WHERE cterm=#{cterm} AND period=#{period});
              IF ISNULL(@id, 0) = 0 THEN
                BEGIN
                  SET @id=idgenerator('dbo.term_konvert_period');

                  INSERT INTO dbo.term_konvert_period (id, period, cterm, issue, info, issued, info_issued)
                  VALUES (@id, #{period}, #{cterm}, #{issue}, #{!info.nil? && info.strip!=''?info : 'null'}, #{issued}, #{!info_issued.nil? && info_issued.strip!=''?info_issued : 'null'});
                END;
              ELSE
                BEGIN
                  UPDATE dbo.term_konvert_period SET info=#{info}, issued=#{issued}, info_issued=#{info_issued} WHERE  cterm=#{cterm} AND period=#{period};
                END;
              ENDIF;

              SELECT @id;
            END;")
        render :text=>{"success"=>true, "id" => id}.to_json
      elsif issue == 0
        ActiveRecord::Base.connection.update ("DELETE FROM dbo.term_konvert_period WHERE cterm=#{cterm} AND period=#{period}")
        info = ''
        render :text => {"success" => true, "info" => info, "issued" => issued, "info_issued" => info_issued}.to_json
      end
    #			when "delete"
    #				render :text => "[]"
    end
  end

  def get_groups
    groups = ActiveRecord::Base.connection.select_all("
      SELECT renew_web.renew_users.id, renew_web.renew_users.name FROM
          renew_web.renew_user_group
              JOIN renew_web.renew_users_groups ON renew_web.renew_users_groups.renew_user_group_id = renew_web.renew_user_group.id
              JOIN renew_web.renew_users ON renew_web.renew_users.id = renew_web.renew_users_groups.renew_user_id
      WHERE
          renew_web.renew_user_group.name = 'Диспетчер' AND renew_web.renew_users.name = '#{session[:user_id]}'
    ")
    render :text => groups.to_json
  end
end