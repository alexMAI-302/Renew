# encoding: utf-8
class Placeunload::BuyersWithoutPlaceunloadController < ApplicationSimpleErrorController

  def get_buyers
    res =  ActiveRecord::Base.connection.select_all("
    select
      b.id id,
      b.name name,
      b.loadto loadto
    from
      buyers b
    where
      b.placeunload_id IS NULL
    order by
      2")

    render :text => res.to_json
  end

  def index
  end
end