# encoding: utf-8
require 'net/https'
require 'uri'
class LoginController < ApplicationController
  def index
  end

  def login
    session[:user_id] = nil
    if request.post?
      if params[:password].size > 0
        user = AdUser.authenticate(params[:name], params[:password])
        if user
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
        else
          flash.now[:notice] = "Ошибочная комбинация пользователя и пароля"
        end
      else
        flash.now[:notice] = "Введите пароль"
      end
    end
    if !params[:access_token].nil?
      uri = URI.parse("https://uoauth.unact.ru/a/uoauth/roles?access_token=#{params[:access_token]}")
      #uri = URI.parse('https://renew.unact.ru/')
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true if uri.scheme == "https"
      http.verify_mode=OpenSSL::SSL::VERIFY_NONE
      http.start {
        http.request_get(uri.request_uri) {|res|
          logger.info uri.request_uri
          t=res.body.force_encoding(Encoding::UTF_8)
          logger.info "!!!#{t.encoding}"
          logger.info t
        }
      }
    end
  end

  def logout
    session.clear
    flash[:notice] = "Вы вышли из системы"
    redirect_to(:action => "login")
  end

end

