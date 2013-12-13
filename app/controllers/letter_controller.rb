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
      #      user_issued = issued==1?session[:user_id] : 'null'
      if issue == 1
        id = ActiveRecord::Base.connection.select_value("
            BEGIN
              DECLARE @id INT;
              DECLARE @issued INT;
              SELECT TOP 1 id , isnull(issued, 0) INTO @id, @issued FROM dbo.term_konvert_period WHERE cterm=#{cterm} AND period=#{period};
              IF ISNULL(@id, 0) = 0 THEN
                BEGIN
                  SET @id=idgenerator('dbo.term_konvert_period');
                  IF #{issued} = 1 THEN
                    INSERT INTO dbo.term_konvert_period (id, period, cterm, issue, info, issued, info_issued, ddate_issued, user_issued)
                    VALUES
                    (
                      @id,
                      #{period},
                      #{cterm},
                      #{issue},
                      #{!info.nil? && info.strip!=''?info : 'null'},
                      #{issued},
                      #{!info_issued.nil? && info_issued.strip!=''?info_issued : 'null'},
                      #{issued==1?'getdate()' : 'null'},
                      '#{session[:user_id]}'
                    );
                  ELSE
                    INSERT INTO dbo.term_konvert_period (id, period, cterm, issue, info, issued, info_issued)
                    VALUES
                    (
                      @id,
                      #{period},
                      #{cterm},
                      #{issue},
                      #{!info.nil? && info.strip!=''?info : 'null'},
                      #{issued},
                      #{!info_issued.nil? && info_issued.strip!=''?info_issued : 'null'}
                    );
                  ENDIF;
                END;
              ELSE
                BEGIN
                  IF @issued <> #{issued} AND #{issued} = 1 THEN
                  BEGIN
                    UPDATE dbo.term_konvert_period SET info=#{info}, issued=#{issued}, info_issued=#{info_issued}, ddate_issued = getdate(), user_issued = '#{session[:user_id]}' WHERE  cterm=#{cterm} AND period=#{period};
                  END;
                  ELSE
                  BEGIN
                    UPDATE dbo.term_konvert_period SET info=#{info}, issued=#{issued}, info_issued=#{info_issued}, ddate_issued = null, user_issued = null WHERE  cterm=#{cterm} AND period=#{period};
                  END;
                  ENDIF;
                END;
              ENDIF;

              SELECT @id;
            END;")
        render :text=>{"success"=>true, "id" => id}.to_json
      elsif issue == 0 && ((info.nil? || info.strip =='') && (info_issued.nil? || info_issued.strip =='') && (issued == 0))
        ActiveRecord::Base.connection.update ("DELETE FROM dbo.term_konvert_period WHERE cterm=#{cterm} AND period=#{period};")
        info = ''
        render :text => {"success" => true, "info" => info, "issued" => issued, "info_issued" => info_issued}.to_json
      elsif issue == 0 && (!(info.nil? || info.strip =='') || !(info_issued.nil? || info_issued.strip =='') || (issued == 1))
        ActiveRecord::Base.connection.update ("UPDATE dbo.term_konvert_period SET issue=#{issue}, info=#{info}, issued=#{issued}, info_issued=#{info_issued} WHERE  cterm=#{cterm} AND period=#{period};")
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