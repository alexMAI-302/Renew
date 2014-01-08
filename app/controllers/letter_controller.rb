# encoding: utf-8
class LetterController < ApplicationSimpleErrorController
  def index

  end

  def letter
    case request.method.to_s
    when "get"
      prefix = ActiveRecord::Base.connection.quote (params[:prefix]).to_s
      rst = ActiveRecord::Base.connection.select_all("
        call dbo.ask_konvert_term_period(#{params[:period].to_i}, #{prefix}, #{params[:manager].to_i})")
      render :text => rst.to_json
    when "put"
      id = params[:id].to_i
      period = params[:period].to_i
      cterm = params[:cterm].to_i
      issue= params[:issue]? 1 : 0
      info = ActiveRecord::Base.connection.quote (params[:info])
      issued= params[:issued]? 1 : 0
      info_issued = ActiveRecord::Base.connection.quote (params[:info_issued])
      logger.info(0)

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
                    UPDATE dbo.term_konvert_period SET issue = #{issue}, info=#{info}, issued=#{issued}, info_issued=#{info_issued}, ddate_issued = getdate(), user_issued = '#{session[:user_id]}' WHERE  cterm=#{cterm} AND period=#{period};
                  END;
                  ELSE
                  BEGIN
                    IF #{issued} = 0 THEN
                      BEGIN
                        UPDATE dbo.term_konvert_period SET issue = #{issue}, info=#{info}, issued=#{issued}, info_issued=#{info_issued}, ddate_issued = null, user_issued = null WHERE  cterm=#{cterm} AND period=#{period};
                      END;
                    ELSE
                      BEGIN
                        UPDATE dbo.term_konvert_period SET issue = #{issue}, info=#{info}, issued=#{issued}, info_issued=#{info_issued} WHERE  cterm=#{cterm} AND period=#{period};
                      END;
                    ENDIF;
                  END;
                  ENDIF;
                END;
              ENDIF;

              SELECT @id;
            END;")
        logger.info(1)
        render :text=>{"success"=>true, "id" => id}.to_json
      elsif issue == 0 && ((info.nil? || info.strip =='') && (info_issued.nil? || info_issued.strip =='') && (issued == 0))
        ActiveRecord::Base.connection.update ("DELETE FROM dbo.term_konvert_period WHERE cterm=#{cterm} AND period=#{period};")
        logger.info(2)
        info = ''
        render :text => {"success" => true, "info" => info, "issued" => issued, "info_issued" => info_issued}.to_json
      elsif issue == 0 && (!(info.nil? || info.strip =='') || !(info_issued.nil? || info_issued.strip =='') || (issued == 1))
        if id == 0
          ActiveRecord::Base.connection.update ("
            INSERT INTO dbo.term_konvert_period
            (id, period, cterm, issue, info, issued, info_issued)
            VALUES (idgenerator('dbo.term_konvert_period'), #{period}, #{cterm}, #{issue}, #{info}, #{issued}, #{info_issued});
            ")
        else
          ActiveRecord::Base.connection.update ("UPDATE dbo.term_konvert_period SET issue=#{issue}, info=#{info}, issued=#{issued}, info_issued=#{info_issued} WHERE  cterm=#{cterm} AND period=#{period};")
        end
        logger.info(3)
        render :text => {"success" => true, "info" => info, "issued" => issued, "info_issued" => info_issued}.to_json
      end
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
  def get_managers
    managers = ActiveRecord::Base.connection.select_all("
      SELECT id, name
      FROM
      (
      SELECT agents.id, agents.name
      FROM
          period p
          JOIN 
          (
            contract_term cterm 
              JOIN buyer_contract bc ON cterm.contract = bc.id
              JOIN contract_type ctype ON bc.type = ctype.id
          ) ON isect(cterm.ddateb, dateadd(month,(IF ctype.code = 'payback' THEN isnull(getuseroption('contractextend'),0) ELSE 0 ENDIF),cterm.ddatee), p.ddateb, p.ddatee) > 0
              JOIN osmp_placement ON osmp_placement.cplacement = cterm.cplacement AND isect(p.ddateb, p.ddatee, osmp_placement.ddate, isnull(osmp_placement.ddatee, '2100-01-01')) > 0
              JOIN agents ON agents.id = osmp_placement.agent 
      WHERE
          p.id = #{params[:period].to_i}
      UNION
          SELECT 0, '_Все'
      ) a
      ORDER BY name
    ")
    render :text => managers.to_json
  end
  
  def get_agents
    agents = ActiveRecord::Base.connection.select_all(
    "
    SELECT agents.id id, agents.name name FROM osmp_placement JOIN agents ON agents.id = osmp_placement.agent GROUP BY agents.id, agents.name
    " )
    render :text => agents.to_json
  end
end