# encoding: utf-8
class RenewUrl < ActiveRecord::Base
  set_table_name "renew_url"
  
  belongs_to :renew_url_type, :class_name => "RenewUrlType", :foreign_key => "url_type_id"
  
  def self.user_urls(user_id)
    RenewUrl.find_by_sql("
    SELECT DISTINCT
      ru.id,
      ru.url_pattern,
      ru.name
    FROM
      renew_web.renew_url ru
      JOIN renew_web.renew_users_urls ruu ON ru.id=ruu.renew_user_url_id
      JOIN renew_web.renew_users_groups rug ON rug.renew_user_group_id=ruu.renew_user_group_id
      JOIN renew_web.renew_users rusr ON rusr.id=rug.renew_user_id
    WHERE
      rusr.name='#{user_id}'
      OR
      rusr.name='guest'
    ORDER BY
      ru.name")
  end
  
  def self.user_menu_subjects(user_id)
    RenewUrl.find_by_sql("
    SELECT DISTINCT
      ru.id,
      ru.url_pattern,
      ru.name
    FROM
      renew_web.renew_url ru
      JOIN renew_web.renew_users_urls ruu ON ru.id=ruu.renew_user_url_id
      JOIN renew_web.renew_users_groups rug ON rug.renew_user_group_id=ruu.renew_user_group_id
      JOIN renew_web.renew_users rusr ON rusr.id=rug.renew_user_id
    WHERE
      ru.url_type_id = (
      SELECT
        id
      FROM
        renew_web.renew_url_type
      WHERE
        name='Пункт меню')
      AND
      (rusr.name='#{user_id}'
      OR
      rusr.name='guest')
    ORDER BY
      ru.name")
  end
end
