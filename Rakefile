# Add your own tasks in files placed in lib/tasks ending in .rake,+
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require(File.join(File.dirname(__FILE__), 'config', 'boot'))

require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

require 'tasks/rails'

desc "clear certificates"
task :clear_certificates do
	d = Dir.new("#{RAILS_ROOT}/public/images/certificates")
	d.each do |filename|
		if filename.end_with? ".jpg" then
			File.delete("#{RAILS_ROOT}/public/images/certificates/#{filename}")
		end
	end
end