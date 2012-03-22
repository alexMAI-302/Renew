class SellPriceController < ApplicationController

	def sell_prices
		ddateb=(params[:ddateb])?(params[:ddateb]):('null')
		ddatee=(params[:ddatee] && params[:ddatee]!="" && params[:ddatee]!="null")?(params[:ddatee]):('01-01-9999')
		case request.method.to_s
			when "get"
			begin
				sell_prices_list = ActiveRecord::Base.connection.select_all(
				"SELECT
					sp.id,
					t.goods_id goods_id,
					t.goods_name goods_name,
					t.lggroup_id lggroup_id,
					t.price*(1-ISNULL(sp.discount, 0)) price,
					#{params[:partner_id]} partner_id,
					CONVERT(date, sp.ddateb) ddateb,
					IF sp.ddatee='9999-01-01' THEN NULL ELSE CONVERT(date,ddatee) END IF ddatee,
					sp.discount*100 discount,
					t.price bprice,
					sp.sell_reason_id
				FROM
					sell_price sp
					JOIN (
					SELECT
						price,
						goods_id,
						goods_name,
						lggroup_id
					FROM
						renew_web.get_price_data(#{params[:partner_id]}, TODAY())) t ON sp.goods=t.goods_id
					JOIN lggroup l ON l.id=t.lggroup_id
				WHERE
					dbo.isect('#{ddateb}', '#{ddatee}', sp.ddateb, sp.ddatee)>0
					AND
					sp.partner=#{params[:partner_id]}")
					
				puts sell_prices_list.to_json
					
				render :text => sell_prices_list.to_json
			end
			when "post"
			begin
				sell_price_rec=SellPrice.new(
				  :partner => params[:partner_id],
				  :goods => params[:goods_id],
				  :ddateb => ddateb,
				  :ddatee => ddatee,
				  :price => params[:bprice],
				  :discount => params[:discount]/100.0,
				  :sell_reason_id => params[:sell_reason_id],
				  :currency => 0,
				  :pmeas => ActiveRecord::Base.connection.select_value("
					SELECT
						pmeas
					FROM
						my_goods
					WHERE
						iam=user_id('dbo') and parent=0 and id=#{params[:goods_id]}"))
				sell_price_rec.id = ActiveRecord::Base.connection.select_value("SELECT idgenerator('sell_price')")
				
				sell_price_rec.save
				
				render :text => sell_price_rec.to_json
			end
			when "put"
			begin
				sell_price_rec=[SellPrice.update(
				  params[:id],
				  {:goods => params[:goods_id],
				  :ddateb => ddateb,
				  :ddatee => ddatee,
				  :price => params[:price],
				  :discount => params[:discount]/100.0,
				  :sell_reason_id => params[:sell_reason_id],
				  :pmeas => ActiveRecord::Base.connection.select_value("
					SELECT
						pmeas
					FROM
						my_goods
					WHERE
						iam=user_id('dbo') and parent=0 and id=#{params[:goods_id]}")})]
				render :text => sell_price_rec.to_json
			end
			when "delete"
			begin
				SellPrice.delete(params[:id])
				render :text => "[]"
			end
		end
	end
	
	def get_goods_prices
		goods_prices=ActiveRecord::Base.connection.select_all(
		"SELECT
			t.goods_id,
			t.goods_name,
			t.lggroup_id,
			t.price
		FROM
			get_price_data(#{params[:partner_id]}, TODAY()) t
		" )
		render :json => goods_prices.to_json
	end
	
	def get_lggroups
		lggroups=ActiveRecord::Base.connection.select_all("
		select	
			l.id,
			l.name
		from 
				lggroup l
		where
			exists( 
				select
					1
				from
					partner_plist ppl 
					join pricelist_prices pp on pp.list=ppl.plist
					join goods g on g.id=pp.goods
					join goods_lggroup() lg ON lg.id=g.id 
				where
					(exists
						(select
							1
						from
							plset_ggroup, goods_groups_tree ggt 
						where
							plset_ggroup.plset=ppl.plset
							and
							plset_ggroup.g_group=ggt.parent and ggt.id=g.g_group
						)
						or not exists (select 1 from plset_ggroup where plset_ggroup.plset=ppl.plset)
					)
					and
					ppl.partner = #{params[:partner_id]} and pp.ddate = today() and l.id=lg.lggroup
			)
		order by
			name")
		render :json => lggroups.to_json
	end
	
	def get_discount_reasons
		discount_reasons=ActiveRecord::Base.connection.select_all("
		SELECT
			id,
			name
		FROM
			sell_reason")
		render :json => discount_reasons.to_json
	end
	
	def get_partners
		val=params[:query]
		
		goods=ActiveRecord::Base.connection.select_all("
		SELECT TOP #{params[:limit]}
			p.id,
			p.name+' ['+pg.name+']' name
		FROM
			partners p
			JOIN partners_groups pg ON pg.id=p.parent
		WHERE
			p.name LIKE '%#{val}%'
		ORDER BY
			p.name")
		render :json => goods.to_json
	end

	def index
	end
end
