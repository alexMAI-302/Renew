Ext.define('app.controller.sellPrice', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.valueModel',
		'app.model.valueStrModel',
		'app.model.sellPrice.sellPriceModel',
		'app.model.sellPrice.goodsPriceModel'],
    init: function() {
	
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		}
		
		Ext.Ajax.request.failure = showServerError;
		
		function checkDateError(goodsId, value){
			if(goodsId){
				var intersect=false;
				var intervals="";
				var cm;
				var ddateb, ddatee;
				
				goodsPricesStore.each(
					function(storeRecord){
						if(storeRecord.get('goods_id') == goodsId){
							cm=storeRecord.get('catmanager_name');
							ddateb=(storeRecord.get('ddateb') && storeRecord.get('ddateb')!='')?
								storeRecord.get('ddateb'):
								new Date('0000-01-01');
							ddatee=(storeRecord.get('ddatee') && storeRecord.get('ddatee')!='')?
								storeRecord.get('ddatee'):
								new Date('9999-01-01');
							intervals+=""+Ext.Date.format(ddateb, "d.m.Y")+" - "+Ext.Date.format(ddatee, "d.m.Y")+"\n";
							if(Ext.Date.between(value, ddateb, ddatee)) {
								intersect=true;
							}
						}
						return true;
					});
				if(!intersect) {
					return "Период действия скидки должен лежать в интервалах: "+intervals+". Обратитесь к КМ "+cm;
				} else {
					return false;
				}
			}
			return false;
		}
		
		function loadSellPrices(){
			sellPricesContainer.setDisabled(true);
			mainContainer.setLoading(true);
			
			var ddateb = new Date(filterPanel.down('#startDate').getValue());
			var ddatee = new Date(filterPanel.down('#endDate').getValue());
			var partnerId=partnersCombo.value;
			
			if(partnerId!=null){
				
				lggroupsStore.proxy.extraParams={
					partner_id: partnerId
				};
				lggroupsStore.load(
					function(records, operation, success){
						if(success){
							goodsPricesStore.proxy.extraParams={
								partner_id: partnerId
							};
							goodsPricesStore.load(
								function(records, operation, success){
									sellPricesStore.proxy.extraParams={
										ddateb: Ext.Date.format(ddateb, 'Y-m-d'),
										ddatee: Ext.Date.format(ddatee, 'Y-m-d'),
										partner_id: partnerId
									};
									sellPricesStore.load(
										function(records, operation, success){
											sellPricesContainer.setDisabled(false);
											mainContainer.setLoading(false);
										}
									);
								}
							);
						}
					}
				);
			} else {
				mainContainer.setLoading(true);
				Ext.Msg.alert('Ошибка', 'Задайте значение для поля "Партнер"');
			}
		};
		
		function findLggroupByGoods(goodsId){
			var lggroupId=null;
			goodsStore.each(
				function(currentRecord){
					if(currentRecord.get('goods_id')==goodsId){
						lggroupId = currentRecord.get('lggroup_id');
					}
					return lggroupId==null;
				});
				
			return lggroupId;
		};
		
		function findLggroupNameById(lggroupId){
			var matching=null;
			lggroupsStore.each(
				function(currentRecord){
					if(currentRecord.get('id') == lggroupId){
						matching=currentRecord.get('name');
					}
					return matching==null;
				});
			return matching;
		};
		
		function loadGoodsStore(lgGrp){
			var currentGoodsPricesData=[],
				yetSelectedGoods={};
				
			if(lgGrp!=null){
				goodsPricesStore.each(
					function(record){
						if(record.get('lggroup_id') == lgGrp && yetSelectedGoods[""+record.get('goods_id')]==null) {
							currentGoodsPricesData.push({
								goods_id: record.get('goods_id'),
								goods_name: record.get('goods_name'),
								price: record.get('price')
							});
							yetSelectedGoods[""+record.get('goods_id')]=true;
						}
						return true;
					});
			}
			
			currentGoodsPricesStore.loadData(currentGoodsPricesData, false);
		};
		
		function getLggroupName(lggroupId){
			var name=null;
			
			lggroupsStore.each(function(record){
				if(record.get("id")==lggroupId){
					name=record.get("name");
				}
				return name==null;
			});
			
			return name;
		}
		
		function sortLggroups(r1, r2){
			var name1=getLggroupName(r1.get("lggroup_id")),
				name2=getLggroupName(r2.get("lggroup_id"));
			name1=(name1!=null)?name1.toLowerCase():'';
			name2=(name2!=null)?name2.toLowerCase():'';
			return (name1>name2)? 1 : ((name1<name2)? -1 : 0);
		}
		
		function getGoodsName(goodsId){
			var name=null;
			
			goodsPricesStore.each(function(record){
				if(record.get("goods_id")==goodsId){
					name=record.get("goods_name");
				}
				return name==null;
			});
			
			return name;
		}
		
		function sortGoods(r1, r2){
			var name1=getGoodsName(r1.get("goods_id")),
				name2=getGoodsName(r2.get("goods_id"));
			name1=(name1!=null)?name1.toLowerCase():'';
			name2=(name2!=null)?name2.toLowerCase():'';
			return (name1>name2)? 1 : ((name1<name2)? -1 : 0);
		}
		
		var partnersStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueStrModel',
			proxy: {
				type: 'ajax',
				url : '/sell_price/get_partners',
				reader: {
					type: 'json'
				}
			}
		});
		
		var sellPricesStore = Ext.create('Ext.data.Store', {
			model: 'app.model.sellPrice.sellPriceModel',
			proxy: {
				type: 'rest',
				url : '/sell_price/sell_prices',
				batchUpdateMode: 'complete',
				reader: {
					type: 'json'
				},
				writer: {
					type: 'json'
				}
			},
			getBatchListeners: function() {
				var listeners={};
				
				listeners.complete = function(batch, operation, options){
					loadSellPrices();
				};
				
				return listeners;
			}
		});
		
		var goodsPricesStore = Ext.create('Ext.data.Store', {
				model: 'app.model.sellPrice.goodsPriceModel',
				proxy: {
					type: 'rest',
					url : '/sell_price/get_goods_prices',
					reader: {
						type: 'json'
					}
				}
			}),
			currentGoodsPricesStore = Ext.create('Ext.data.Store', {
				model: 'app.model.sellPrice.goodsPriceModel',
				proxy: {
			        type: 'memory'
				}
			}),
			lggroupsStore = Ext.create('Ext.data.Store', {
				model: 'app.model.valueModel',
				proxy: {
					type: 'rest',
					url : '/sell_price/get_lggroups',
					reader: {
						type: 'json'
					}
				}
			}),
			discountReasonsStore = Ext.create('Ext.data.Store', {
				model: 'app.model.valueModel',
				autoLoad: true,
				proxy: {
					type: 'rest',
					url : '/sell_price/get_discount_reasons',
					reader: {
						type: 'json'
					}
				}
			}),
			mainContainer=Ext.create('Ext.container.Container', {
				width: 1100,
				layout: {
					type: 'anchor'
				},
				renderTo: Ext.get('sell_price_js'),
				defaults: {
					style: {
						margin: '10px'
					}
				}
			}),
			filterPanel=Ext.create('Ext.form.Panel',{
				layout: {
					type: 'hbox'
				},
				defaults: {
					style: {
						margin: '5px'
					}
				},
				items: [{
					id: 'startDate',
					xtype: 'datefield',
					name: 'startDate',
					fieldLabel: 'Начало периода',
					format: 'd.m.Y',
					altFormat: 'd/m/Y|d m Y',
					startDay: 1,
					value: Ext.Date.add(new Date(Ext.Date.now()), Ext.Date.DAY, -3)
				},{
					id: 'endDate',
					xtype: 'datefield',
					name: 'endDate',
					fieldLabel: 'Конец периода',
					format: 'd.m.Y',
					altFormat: 'd/m/Y|d m Y',
					startDay: 1,
					value: new Date(Ext.Date.now())
				}]
			}),
			partnersCombo=Ext.create('Ext.form.ComboBox', {
				fieldLabel: 'Партнер',
				store: partnersStore,
				displayField: 'name',
				valueField: 'id',
				allowBlank: false,
				labelWidth: 50,
				width: 400,
				listeners: {
					"select": function(field, value, options ) {
						filterSellPrices.setDisabled(value[0].id==null);
						return true;
					},
					"change": function(field, newValue, oldValue, options) {
						filterSellPrices.setDisabled(partnersCombo.value==null);
						return true;
					}
				}
			}),
			filterSellPrices=Ext.create('Ext.Button', {
				text    : 'Фильтр',
				handler : loadSellPrices,
				disabled: true
			});
		
		filterPanel.add(partnersCombo);
		filterPanel.add(filterSellPrices);
		mainContainer.add(filterPanel);
	
		var cellEditingSellPrices = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1
			}),
			sellPricesContainer = Ext.create('Ext.container.Container', {
				width: 1100,
				layout: {
					type: 'anchor'
				},
				defaults: {
					style: {
						margin: '10px'
					}
				},
				margin: '-0px',
				disabled: true
			}),
			spId='sellPricesTable';
		
		var sellPricesPanel=Ext.create('Ext.grid.Panel', {
			id: spId,
			title: 'Скидки',
			store: sellPricesStore,
			columns: [
				{
					header: 'Идентификатор',
					dataIndex: 'id',
					hidden: true,
					disabled: true
				},
				{
					header: 'Дата начала',
					dataIndex: 'ddateb',
					width: 100,
					field: {
						xtype: 'datefield',
						format: 'd.m.Y',
						altFormats: 'd/m/Y|d m Y|Y-m-d',
						startDay: 1
					},
					renderer: function(value, metaData, record){
						return (value)?Ext.Date.format(new Date(value), 'd.m.Y'):'';
					}
				},
				{
					header: 'Дата конца',
					dataIndex: 'ddatee',
					width: 100,
					field: {
						xtype: 'datefield',
						format: 'd.m.Y',
						altFormats: 'd/m/Y|d m Y|Y-m-d',
						startDay: 1
					},
					renderer: function(value){
						return (value)?Ext.Date.format(new Date(value), 'd.m.Y'):'';
					}
				},
				{
					width: 190,
					header: 'Группа планирования',
					gridId: spId,
					dataIndex: 'lggroup_id',
					doSort: function(state){
						sellPricesStore.sort({
							sorterFn: sortLggroups,
							direction: state
						});
						return true;
					},
					renderer: function(value, metaData, record){
						var lggroupId=null, matching=null;
						//ищем группу планирования для товара
						if(value!=null){
							lggroupId=value;
						} else {
							lggroupId=findLggroupByGoods(value)
						}
						//если группа планирования определена, то по идентификатору получаем ее название
						if(lggroupId!=null){
							matching=findLggroupNameById(lggroupId);
						}
						
						return (matching) ? matching : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: lggroupsStore,
						displayField: 'name',
						valueField: 'id',
						allowBlank: false,
						queryMode: 'local',
						listeners: {
							"select": function(field, value, options){
								var selection=sellPricesPanel.getSelectionModel().getSelection()[0];
								
								selection.set('goods_id', null);
								selection.set('goods_name', null);
								
								return true;
							}
						}
					})
				},
				{
					width: 250,
					header: 'Товар',
					dataIndex: 'goods_id',
					gridId: spId,
					doSort: function(state){
						sellPricesStore.sort({
							sorterFn: sortGoods,
							direction: state
						});
						return true;
					},
					renderer: function(value, metaData, record){
						var matching=null;
						if(value!=null){
							goodsPricesStore.each(
								function(storeRecord){
									if(storeRecord.get('goods_id') == value){
										matching=storeRecord.get('goods_name');
									}
									return matching==null;
								});
						}
						return (matching) ? matching : record.get('goods_name');
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: currentGoodsPricesStore,
						displayField: 'goods_name',
						valueField: 'goods_id',
						queryMode: 'local',
						allowBlank: false,
						selectOnFocus: true,
						listeners: {
							"select": function(field, value, options){
								var r = sellPricesPanel.getSelectionModel().getSelection()[0];
								
								r.set('bprice', value[0].data.price);
								r.set('price', value[0].data.price);
								r.set('discount', 0);
								r.set('goods_name', value[0].data.goods_name);
								
								return true;
							},
							"expand": function(field, eOpts){
								var lgGrp=sellPricesPanel.getSelectionModel().getSelection()[0].get("lggroup_id");
								loadGoodsStore(lgGrp);
								return true;
							}
						}
					})
				},
				{
					header: 'Скидка, %',
					dataIndex: 'discount',
					width: 65,
					field: {
						xtype: 'numberfield',
						minValue: 0,
						maxValue: 99,
						listeners:{
							"change": function(t, newValue, oldValue, options){
								var r = sellPricesPanel.getSelectionModel().getSelection()[0];
								r.beginEdit();
								r.set("price", r.get("bprice")*(1-parseInt(newValue)/100.0));
								r.endEdit(true);
								return true;
							}
						}
					}
				},
				{
					header: 'Цена до скидки',
					dataIndex: 'bprice',
					renderer: Ext.util.Format.numberRenderer('0.0000'),
					disabled: true
				},
				{
					header: 'Цена после скидки',
					width: 110,
					dataIndex: 'price',
					renderer: Ext.util.Format.numberRenderer('0.0000')
				},
				{
					width: 150,
					header: 'Причина скидки',
					dataIndex: 'sell_reason_id',
					renderer: function(value, metaData, record){
						var matching=null;
						if(value!=null){
							discountReasonsStore.each(
								function(storeRecord){
									if(storeRecord.get('id') == value){
										matching=storeRecord.get('name');
									}
									return matching==null;
								});
						}
						return (matching) ? matching : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: discountReasonsStore,
						displayField: 'name',
						valueField: 'id',
						queryMode: 'local',
						selectOnFocus: true
					})
				}
			],
			selModel: {
				selType: 'rowmodel'
			},
			plugins: [cellEditingSellPrices],
			height: 400,
			tbar: [{
				text: 'Добавить скидку',
				handler : function() {
					cellEditingSellPrices.cancelEdit();
					
					var r = Ext.ModelManager.create({
						partner_id	: partnersCombo.value
					}, 'app.model.sellPrice.sellPriceModel');
					sellPricesStore.insert(0, r);
				}
			}, {
				itemId: 'removeSellPrice',
				text: 'Удалить скидку',
				handler: function() {
					var sm = sellPricesPanel.getSelectionModel();
					cellEditingSellPrices.cancelEdit();
					sellPricesStore.remove(sm.getSelection());
					if (sellPricesStore.getCount() > 0) {
						sm.select(0);
					} else {
						sellPricesStore.removeAll(true);
					}
				},
				disabled: true
			}],
			bbar: [{
				text    : 'Сохранить',
				handler : function() {
					var selection=sellPricesPanel.getSelectionModel().getSelection()[0];
					
					var error=false, errorTxt;
					sellPricesStore.each(function(record){
						var msg="";
						var data=(record.data!=null)?record.data:{};
						if(!(data.goods_id)>0){
							msg+="Не заполнено поле \"Товар\"\n";
							error=true;
						}
						
						if(!(data.sell_reason_id)>0){
							msg+="Не заполнено поле \"Причина скидки\"\n";
							error=true;
						}
						
						errorTxt=checkDateError(
							data.goods_id,
							(data.ddateb)?data.ddateb:(new Date('0000-01-01')),
							(data.ddatee)?data.ddatee:(new Date('9999-01-01')));
						if(errorTxt){
							msg+=errorTxt+"\n";
							error=true;
						}
						
						if(error){
							Ext.Msg.alert('Ошибка', msg);
							sellPricesPanel.getSelectionModel().select(record.id);
							return false;
						} else {
							return true;
						}
					});
					if(!error){
						sellPricesStore.proxy.extraParams={};
						sellPricesStore.sync();
					}
					if(selection!=null && selection.date!=null){
						partnersCombo.value=selection.data.partner_id;
						sellPricesPanel.getSelectionModel().select(sellPricesStore.getById(selection.data.id));
					}
				}
			}],
			listeners: {
				'selectionchange': function(view, records) {
					var disabled=!records.length;
					
					sellPricesPanel.down('#removeSellPrice').setDisabled(disabled);
				}
			}
		});
		
		sellPricesContainer.add(sellPricesPanel);
		mainContainer.add(sellPricesContainer);
	}
});