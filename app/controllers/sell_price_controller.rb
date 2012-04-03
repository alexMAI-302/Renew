# encoding: utf-8

class SellPriceController < ApplicationController

	def sell_prices
		ddateb=(nullify params[:ddateb])[0..9]
		ddatee=(params[:ddatee] && params[:ddatee]!="" && params[:ddatee]!="null")?(params[:ddatee][0..9]):('01-01-9999')
		
		strs=params[:partner_id].split("_")
		partner_id=strs[0]
		site_id=strs[1]
		
		case request.method.to_s
			when "get"
			begin
				sell_prices_list = Proxycat.connection.select_all(
				"exec dbo.get_data_site '
				SELECT
					sp.id,
					t.goods_id goods_id,
					t.goods_name goods_name,
					t.lggroup_id lggroup_id,
					t.price*(1-ISNULL(sp.discount, 0)) price,
					''#{partner_id}_#{site_id}'' partner_id,
					CONVERT(varchar(10), sp.ddateb, 120) ddateb,
					IF sp.ddatee=''9999-01-01'' THEN NULL ELSE CONVERT(varchar(10),ddatee, 120) END IF ddatee,
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
						renew_web.get_price_data(#{partner_id}, TODAY())) t ON sp.goods=t.goods_id
				WHERE
					dbo.isect(''#{ddateb}'', ''#{ddatee}'', sp.ddateb, sp.ddatee)>0
					AND
					sp.partner=#{partner_id}
					AND
					sp.price IS NULL',
				#{site_id}
				")
					
				puts sell_prices_list.to_json
					
				render :text => sell_prices_list.to_json
			end
			when "post"
			begin
				Proxycat.connection.execute(
				"exec dbo.iud_data_site '
				INSERT INTO sell_price(
					id,
					partner,
					goods,
					ddateb,
					ddatee,
					discount,
					sell_reason_id,
					currency,
					pmeas)
				SELECT
					idgenerator(''sell_price''),
					#{partner_id},
					#{params[:goods_id]},
					''#{ddateb}'',
					''#{ddatee}'',
					#{params[:discount]/100.0},
					#{nullify params[:sell_reason_id]},
					0,
					(SELECT
						pmeas
					FROM
						my_goods
					WHERE
						iam=user_id(''dbo'') and parent=0 and id=#{params[:goods_id]})',
				#{site_id}
				")
				
				render :text => "[]"
			end
			when "put"
			begin
				Proxycat.connection.execute(
				"exec dbo.iud_data_site '
				UPDATE sell_price SET
					partner=#{partner_id},
					goods=#{params[:goods_id]},
					ddateb=''#{ddateb}'',
					ddatee=''#{ddatee}'',
					discount=#{params[:discount]/100.0},
					sell_reason_id=#{nullify params[:sell_reason_id]},
					pmeas=(SELECT
						pmeas
					FROM
						my_goods
					WHERE
						iam=user_id(''dbo'') and parent=0 and id=#{params[:goods_id]})
				WHERE
					id=#{params[:id]} AND price IS NULL',
				#{site_id}
				")
				
				render :text => "[]"
			end
			when "delete"
			begin
				Proxycat.connection.execute(
				"exec dbo.iud_data_site '
				DELETE FROM sell_price
				WHERE
					id=#{params[:id]}',
				#{site_id}
				")
				render :text => "[]"
			end
		end
	end
	
	def get_goods_prices
		strs=params[:partner_id].split("_")
		partner_id=strs[0]
		site_id=strs[1]
		
		goods_prices=Proxycat.connection.select_all(
		"exec dbo.get_data_site '
		SELECT
			t.goods_id,
			t.goods_name,
			t.lggroup_id,
			t.price,
			CONVERT(varchar(10), t1.ddateb, 120) ddateb,
			CONVERT(varchar(10), t1.ddatee, 120) ddatee
		FROM
			renew_web.get_price_data(#{partner_id}, TODAY()) t
			JOIN (SELECT
				gsgl.goods goods_id,
				bp.ddateb,
				bp.ddatee
			FROM
				dbo.bp_groups bp_g
				JOIN dbo.bprog bp ON bp_g.id=bp.bp_group
				JOIN dbo.goods_set gs ON gs.id=bp.goods_set
				JOIN dbo.gsg_link gsgl ON gs.id=gsgl.goods_set
			WHERE
				bp_g.name=''Желтый ценник'') t1 ON t.goods_id=t1.goods_id',
		#{site_id}
		")
		render :json => goods_prices.to_json
	end
	
	def get_lggroups
		strs=params[:partner_id].split("_")
		partner_id=strs[0]
		site_id=strs[1]
		
		lggroups=Proxycat.connection.select_all(
		"exec dbo.get_data_site '
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
					ppl.partner = #{partner_id} and pp.ddate = today() and l.id=lg.lggroup
			)
		order by
			name',
		#{site_id}
		")
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
		partners=Proxycat.connection.select_all("
		exec dbo.ask_sell_price_user_partners '#{session[:user_id]}', '#{params[:query]}', #{params[:limit]}")
		render :json => partners.to_json
	end

	def index
	end
	
	private
	def nullify val
		val=(val.nil? || val=="")? "null" : val
	end

end
