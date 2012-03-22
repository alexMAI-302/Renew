Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
    'Ext.ux.CheckColumn'
]);
Ext.define('sellPrice.controller.sellPrice', {
    extend: 'Ext.app.Controller',
	models: [
		'sellPrice.model.sellPriceModel',
		'sellPrice.model.valueModel',
		'sellPrice.model.goodsModel',
		'sellPrice.model.goodsPriceModel'],
    init: function() {
	
		var user_id, user_name;
		var sellPriceGoodsData=[], sellPriceLggroupsData=[], sellPriceCurrentGoodsData=[], sellPriceCurrentLggroupsData=[];;
		
		//localStorage.removeItem("ru_unact_renew_sell_price_goods_data");
		//localStorage.removeItem("ru_unact_renew_sell_price_lggroups_data");
		
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		}
		
		Ext.Ajax.request.failure = showServerError;
		
		function loadSellPrices(){
			var ddateb = new Date(filterPanel.down('#startDate').getValue());
			var ddatee = new Date(filterPanel.down('#endDate').getValue());

			sellPricesStore.proxy.extraParams={
				ddateb: Ext.Date.format(ddateb, 'Y-m-d'),
				ddatee: Ext.Date.format(ddatee, 'Y-m-d'),
				partner: partnersCombo.value
			};
			sellPricesStore.load(
				function(records, operation, success){
					if(success){
						goodsPriceStore.load(
							function(records1, operation1, success1){
								sellPricesContainer.setDisabled(false);
								mainContainer.setLoading(false);
							}
					}
				});
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
			return matching
		};
		
		var partnersStore = Ext.create('Ext.data.Store', {
			model: 'sellPrice.model.valueModel',
			proxy: {
				type: 'ajax',
				url : '/sell_price/get_partners',
				reader: {
					type: 'json'
				}
			}
		});
		
		var sellPricesStore = Ext.create('Ext.data.Store', {
			model: 'sellPrice.model.sellPriceModel',
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
		
		var goodsStore = Ext.create('Ext.data.ArrayStore', {
			model: 'sellPrice.model.goodsModel',
			data: sellPriceGoodsData
		});
		
		var goodsPriceStore = Ext.create('Ext.data.ArrayStore', {
			model: 'sellPrice.model.goodsPriceModel',
			proxy: {
				type: 'rest',
				url : '/sell_price/get_goods_prices',
				reader: {
					type: 'json'
				}
			}
		});
		
		var currentGoodsStore = Ext.create('Ext.data.ArrayStore', {
			model: 'sellPrice.model.valueModel',
			data: sellPriceCurrentGoodsData
		});
		
		var currentLggroupsStore = Ext.create('Ext.data.ArrayStore', {
			model: 'sellPrice.model.valueModel',
			data: sellPriceCurrentLggroupsData
		});
		
		var lggroupsStore = Ext.create('Ext.data.ArrayStore', {
			model: 'sellPrice.model.valueModel',
			data: sellPriceLggroupsData
		});
		
		var mainContainer=Ext.create('Ext.container.Container', {
			width: 1000,
			layout: {
				type: 'anchor'
			},
			renderTo: Ext.get('sell_price_js'),
			defaults: {
				style: {
					margin: '10px'
				}
			}
		});
		
		var filterPanel=Ext.create('Ext.form.Panel',{
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
		});
		
		var partnersCombo=Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Партнер',
			store: partnersStore,
			displayField: 'name',
			valueField: 'id'
		});
		
		var filterSellPrices=Ext.create('Ext.Button', {
			text    : 'Фильтр',
			handler : loadSellPrices
		});
		
		filterPanel.add(partnersCombo);
		filterPanel.add(filterSellPrices);
		mainContainer.add(filterPanel);
	
		var cellEditingSellPrices = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});
		
		var sellPricesContainer = Ext.create('Ext.container.Container', {
			width: 1000,
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
		});
	
		var spId='sellPricesTable';
		
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
						altFormat: 'd/m/Y|d m Y',
						startDay: 1,
					},
					renderer: function(value){
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
						altFormat: 'd/m/Y|d m Y',
						startDay: 1,
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
						queryMode: 'local',
						displayField: 'name',
						valueField: 'id',
						allowBlank: false,
						listeners: {
							"select": function(field, value, options){
								var selection=sellPricesPanel.getSelectionModel().getSelection()[0];
								
								var sellPriceCurrentGoodsData=[];
								var lgGrp=value[0].data.id;
								if(lgGrp!=null){
									goodsStore.each(
										function(record){
											if(record.get('lggroup_id') == lgGrp) {
												var matching=null;
												goodsPriceStore.each(
													function(recordPrice){
														if(recordPrice.get('goods_id')==record.get(goods_id)){
															matching=true;
															sellPriceCurrentGoodsData.push({
																id: record.get('goods_id'),
																name: record.get('name')
															});
														}
														return matching==null;
													}
												);
											}
											return true;
										});
								}
								
								currentGoodsStore.loadData(sellPriceCurrentGoodsData, false);
								
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
					renderer: function(value, metaData, record){
						var matching=null;
						if(value!=null){
							currentGoodsStore.each(
								function(storeRecord){
									if(storeRecord.get('id') == value){
										matching=storeRecord.get('name');
									}
									return matching==null;
								});
						}
						return (matching) ? matching : record.get('goods_name');
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: currentGoodsStore,
						displayField: 'name',
						valueField: 'id',
						queryMode: 'local',
						allowBlank: false,
						selectOnFocus: true,
						listeners: {
							"change": function(t, n, o, eOpts ) {
								console.log("!!!@!@!");
								var r = sellPricesPanel.getSelectionModel().getSelection()[0];
								var lgGrp=(r!=null)?(r.get('lggroup_id')):(null);
								var sellPriceCurrentGoodsData=[];
								console.log("!!"+lgGrp);
								if(lgGrp!=null){
									goodsStore.each(
										function(record){
											if(record.get('lggroup_id') == lgGrp) {
												sellPriceCurrentGoodsData.push({
													id: record.get('goods_id'),
													name: record.get('name')
												});
											}
											return true;
										});
								}
								
								currentGoodsStore.loadData(sellPriceCurrentGoodsData, false);
								return true;
							},
							"select": function(field, value, options){
								
							}
						}
					})
				},
				{
					header: 'Скидка',
					dataIndex: 'discount',
					width: 50,
					field: {
						xtype: 'numberfield',
						allowDecimals: true,
						decimalPrecision: 1,
						listeners:{
							"change": function(t, newValue, oldValue, options){
								var r = sellPricesPanel.getSelectionModel().getSelection()[0];
								r.set("price", r.get("bprice")*(1-newValue));
							}
						}
					}
				},
				{
					header: 'Цена до скидки',
					dataIndex: 'bprice',
					disabled: true
				},
				{
					header: 'Цена после скидки',
					width: 110,
					dataIndex: 'price',
					field: {
						xtype: 'numberfield',
						allowDecimals: true,
						decimalPrecision: 1
					}
				},
				{
					width: 150,
					header: 'Причина скидки',
					dataIndex: 'discount_reason',
					field: {
						xtype: 'textfield'
					}
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
					}, 'sellPrice.model.sellPriceModel');
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
					
					sellPricesStore.proxy.extraParams={};
					sellPricesStore.sync();
					if(selection!=null){
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
		
		function setGoodsData(){
			sellPriceGoodsData=eval('('+localStorage.getItem("ru_unact_renew_sell_price_goods_data")+')');
			goodsStore.loadData(sellPriceGoodsData);
		};
		function setLggroupsData(){
			sellPriceLggroupsData=eval('('+localStorage.getItem("ru_unact_renew_sell_price_lggroups_data")+')');
			lggroupsStore.loadData(sellPriceLggroupsData);
		};
		
		if(localStorage.getItem("ru_unact_renew_sell_price_lggroups_data")==null ||
			localStorage.getItem("ru_unact_renew_sell_price_lggroups_data")==""){
			Ext.Ajax.request({
				url: '/sell_price/get_lggroups',
				success: function(response){
					localStorage.setItem("ru_unact_renew_sell_price_lggroups_data", response.responseText);
					setLggroupsData();
				}
			});
		} else {
			setLggroupsData();
		}
		
		if(localStorage.getItem("ru_unact_renew_sell_price_goods_data")==null ||
			localStorage.getItem("ru_unact_renew_sell_price_goods_data")==""){
			Ext.Ajax.request({
				url: '/sell_price/get_goods',
				success: function(response){
					localStorage.setItem("ru_unact_renew_sell_price_goods_data", response.responseText);
					setGoodsData();
				}
			});
		} else {
			setGoodsData();
		}
	}
});