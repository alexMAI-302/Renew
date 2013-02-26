# encoding: utf-8
require 'net/ldap'

class AdUser
  attr_accessor :user_id
  attr_accessor :mail
  attr_accessor :displayname
  attr_accessor :userprincipalname
  
  def self.authenticate( name, password )
    make_ldap_query do |ldap, conf|
      name += conf["prefix"] if not name[conf["prefix"]]
      user = find({:userprincipalname => name}, ldap)
      if RenewUser.find(:first, :conditions => ["name = ?", name]).nil?
        RenewUser.create(:name => name)
      end
      ldap.auth name, password
      if !ldap.bind
        user=nil
      end
      user
    end
  end
  
  def self.find_by_name(name)
    make_ldap_query do |ldap, user, conf|
      find({:userprincipalname => name}, ldap)
    end
  end
  
  def self.find_by_email(email)
    make_ldap_query do |ldap, conf|
      find({:mail => email}, ldap)
    end
  end
  
  private
  def self.find(options, ldap)
    s=""
    options.each_pair do |key, value|
      s+="#{key}=#{value} "
    end
    Rails.logger.info s
    user=nil
    filter = Net::LDAP::Filter.construct(s)
    ldap.search( :base => "dc=unact,dc=ru", :filter => filter ) do |entry|
      user = AdUser.new
      user.mail=entry["mail"].to_s.delete("[").delete("]").delete("\"")
      user.displayname=entry["displayname"].to_s.delete("[").delete("]").delete("\"")
      user.userprincipalname=entry["userprincipalname"].to_s.delete("[").delete("]").delete("\"")
      user.user_id = user.userprincipalname
    end
    user
  end
  
  def self.make_ldap_query
    conf = Rails.configuration.database_configuration["ldap_#{RAILS_ENV}"]

    ldap = Net::LDAP.new
    ldap.host = conf["host"]
    ldap.auth conf["username"]+conf["prefix"], conf["password"]
    user=nil
    if ldap.bind
      user = yield(ldap, conf)
    end
    return user
  end
end
