class BprogController < ApplicationController


  def index

  end
  
  def do_bprog
	@rst = Proxycat.connection.select_all('execute hqsrv12.proxycat.dbo.prc_bprog select 1 a')
  end

end