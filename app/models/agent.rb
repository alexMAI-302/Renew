# encoding: utf-8
class Agent < ActiveRecord::Base
  belongs_to :agent_group, :foreign_key => :a_group
end
