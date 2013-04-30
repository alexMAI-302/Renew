# encoding: utf-8
class AboutController < ApplicationSimpleErrorController

	def index	
		f = IO.popen("cd /var/www/renew\ngit log -1 --pretty=format:'%H %ci'") 
		gitlog = f.readlines #возвращает массив строк (в нашем случае всего одна строка)
		f.close

		data = gitlog[0].split #получаем массив с элементами: 0 - хэш коммита, 1 - дата, 2 - время, 3 - timezone

		@commit = "https://github.com/Unact/Renew/commit/" + data[0].to_s
		@ddate = DateTime.iso8601(data[1] + "T" + data[2] + data[3].insert(3, ":"))
	end
end
  