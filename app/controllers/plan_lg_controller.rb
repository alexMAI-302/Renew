class PlanLgController < ApplicationController

  def index

  end

  def do_plan
     es = 'exec prc_fill_plan_lg'
     puts 'Executing: ' + es
     r = Proxycat.connection.execute( es ) 
     puts 'Well done: ' + es
     redirect_to :action => 'index'
   end

end
