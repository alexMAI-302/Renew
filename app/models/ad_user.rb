# encoding: utf-8
require 'net/ldap'

class AdUser
  attr_accessor :user_id
  attr_accessor :mail
  attr_accessor :displayname
  attr_accessor :userprincipalname
  def self.authenticate( name, password )
    conf = Rails.configuration.database_configuration["ldap_#{RAILS_ENV}"]

    ldap = Net::LDAP.new
    ldap.host = conf["host"]
    name += conf["prefix"] if not name[conf["prefix"]]
    ldap.auth name, password
    user = nil
    if ldap.bind
      user = AdUser.new
      user.user_id = name
      s = nil
      ldap.auth conf["username"]+conf["prefix"], conf["password"]
      if ldap.bind
        filter = Net::LDAP::Filter.construct( "userprincipalname=#{name}" )
        ldap.search( :base => "dc=unact,dc=ru", :filter => filter ) do |entry|
          user.mail=entry["mail"].to_s.delete("[").delete("]").delete("\"")
          user.displayname=entry["displayname"].to_s.delete("[").delete("]").delete("\"")
          user.userprincipalname=entry["userprincipalname"].to_s.delete("[").delete("]").delete("\"")
        end
        if RenewUser.find(:first, :conditions => ["name = ?", name]).nil?
          RenewUser.create(:name => name)
        end
      else
        puts "User authorization Failed"
      end
    end
    user
  end
end
