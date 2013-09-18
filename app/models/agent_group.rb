# encoding: utf-8
class AgentGroup < ActiveRecord::Base
	
  has_many :agents, :foreign_key => :a_group, :order => :name
end
