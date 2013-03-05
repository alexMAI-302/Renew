# encoding: utf-8
require 'net/https'
require 'uri'
require 'nokogiri'

class LoginController < ApplicationController
  def index
  end

  def login
    session[:user_id] = nil
    if request.post?
      if params[:password].size > 0
        user = AdUser.authenticate(params[:name], params[:password])
        if user
          create_user_session(user)
        else
          flash.now[:notice] = "Ошибочная комбинация пользователя и пароля"
        end
      else
        flash.now[:notice] = "Введите пароль"
      end
    end
    if !params[:access_token].nil?
      uri = URI.parse("https://uoauth.unact.ru/a/uoauth/roles?access_token=#{params[:access_token]}")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true if uri.scheme == "https"
      http.verify_mode=OpenSSL::SSL::VERIFY_NONE
      http.start {
        http.request_get(uri.request_uri) {|res|
          t=res.body.force_encoding(Encoding::UTF_8)
          xml_doc = Nokogiri::XML(t)
          account_info = xml_doc.css('response account').first
          if !account_info.nil?
            id = account_info.css('id').first.content.to_i
            email = account_info.css('email').first.content
            name = account_info.css('name').first.content
            outside_user = RenewOutsideUser.find(
              :first,
              :conditions => ["system_id = ?", id])
            user=AdUser.find_by_email(email)
            renew_user = RenewUser.find(
              :first,
              :conditions => ["name=?", user.user_id]) if !user.nil?
            if renew_user.nil? && !user.nil?
              renew_user = RenewUser.create(:name => user.user_id)
            end
            if outside_user.nil?
              outside_user = RenewOutsideUser.new
              outside_user.system_id = id
              outside_user.renew_user_id = renew_user.id if !renew_user.nil?
              outside_user.email = email
              outside_user.account_info = account_info.to_s
              outside_user.save
            else
              if outside_user.account_info!=account_info.to_s
                outside_user.update(
                  :account_info => account_info,
                  :email => email)
              end
            end
            
            if user.nil?
              user = AdUser.new
              user.user_id = id
              user.mail = email
              user.displayname = name
              user.userprincipalname = id
            end
            create_user_session(user)
          else
            flash.now[:notice] = "Неправильный код авторизации"
          end
        }
      }
    end
  end

  def logout
    session.clear
    flash[:notice] = "Вы вышли из системы"
    redirect_to(:action => "login")
  end
  
  private
  def create_user_session(user)
    session[:user_id] = user.user_id
    session[:user_mail] = user.mail
    session[:user_displayname] = user.displayname
    session[:user_name] = user.userprincipalname
    if session[:return_to]
      redirect_to(session[:return_to])
      session[:return_to] = nil
    else
      redirect_to("/")
    end
  end

end