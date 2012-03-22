# encoding: utf-8
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
  end

  def logout
    session.clear
    flash[:notice] = "Вы вышли из системы"
    redirect_to(:action => "login")
  end 

end

