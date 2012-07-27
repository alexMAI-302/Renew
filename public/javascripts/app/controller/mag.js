Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
    'Ext.ux.CheckColumn',
	'Ext.ux.grid.Printer'
]);
Ext.define('app.controller.mag', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'app.store.mag.goods',
		'app.store.mag.currentPalmSaleItemsLocal',
		'app.store.mag.palmSaleItemsLocal',
		'app.store.mag.palmSalesLocal',
		'app.store.mag.palmSaleItems',
		'app.store.mag.palmSales'
	],
	
	models: [
		'valueModel',
		'mag.goodsModel',
		'mag.palmSaleModel',
		'mag.palmSaleItemModel'
	],
	
	views: [
		'app.view.mainContainer',
		'app.view.mag.magTabs',
		'app.view.mag.currentPalmSaleOrder.Grid'
	],
	
	noRemains: 'Не хватает остатков',
	
	currentPalmSaleItemsLocalStore: null,
	
	palmSaleItemsLocalStore: null,
	palmSalesLocalStore: null,
	
	palmSaleItemsStore: null,
	palmSalesStore: null,
	
	goodsStore: null,
	
	mainContainer: null,
	
	salesToSync: 0,
	requestsRemains: 0,
	
	showServerError: function(response) {
		Ext.Msg.alert('Ошибка', response.responseText);
	},
	
	makePalmItemVolume: function(
		palmGoods,
		volume
	){
		var controller = this;
		var storageGoods=controller.goodsStore.data.findBy(function(record){
			return (
				record.get('barcode') == palmGoods.get('barcode') &&
				(palmGoods.get('volume') + record.get('volume')) >= volume
			);
		});
		
		//если есть достаточное количество остатка товара, то меняем количетсво в позиции заказа и остаток
		if(storageGoods!=null && storageGoods.get('id') > 0){
			storageGoods.set('volume', storageGoods.get('volume') + palmGoods.get('volume') - volume);
			palmGoods.set('volume', volume);
			palmGoods.set('cost', volume*palmGoods.get('price'));
			
			controller.currentPalmSaleItemsLocalStore.sync();
			controller.goodsStore.sync();
			return true;
		} else {
			return false;
		}
	},
	
	syncPalmSale: function(palmSale){
		var controller=this;
		
		Ext.Ajax.request({
			url: '/new_mag/palm_sale_save',
			timeout: 300000,
			jsonData: {
				palm_sale: palmSale
			},
			callback: function(options, success, response){
				if(success===true){
					controller.palmSalesLocalStore.each(function(r){
						if(r.get('id')==palmSale.id){
							palmSalesLocalStore.remove(r);
							return false;
						} else {
							return true;
						}
					});
					
					controller.palmSaleItemsLocalStore.each(function(r){
						if(r.get('sale_id')==palmSale.id){
							palmSalesLocalStore.remove(r);
						}
						return true;
					});
					controller.salesToSync--;
				}
				
				controller.requestsRemains--;
				if(controller.requestsRemains==0){
					if(controller.salesToSync>0){
						Ext.Msg.alert('', 'Остались несинхронизированные заказы');
					} else {
						Ext.Msg.alert('', 'Все заказы успешно синхронизированы');
					}
					
					Ext.getCmp('syncPalmSales').setText('Синхронизировать заказы');
					Ext.getCmp('syncPalmSales').setDisabled(false);
				}
			}
		});
	},
	
	saveCurrentPalmSale: function(){
		var controller = this,
			minPalmSale = -controller.palmSalesLocalStore.getCount() - 1,
			minPalmSaleItems = -controller.palmSaleItemsLocalStore.getCount(),
			sumTotal = 0,
			saleItems=[];
		
		controller.currentPalmSaleItemsLocalStore.each(function(record){
			minPalmSaleItems--;
			
			var r = record.copy();
			sumTotal += r.get('cost');
			r.set('id', minPalmSaleItems);
			r.set('sale_id', minPalmSale);
			r.setDirty();
			
			controller.palmSaleItemsLocalStore.add(r);
			saleItems.push(r.gedData());
			
			return true;
		});
		
		var r = Ext.ModelManager.create({
			id: minPalmSale,
			ddate: new Date(),
			sumtotal: sumTotal
		}, 'app.model.mag.palmSaleModel');
		r.setDirty();
		
		controller.palmSalesLocalStore.add(r);
		
		controller.salesToSync++;

		controller.currentPalmSaleItemsLocalStore.proxy.clear();
		controller.currentPalmSaleItemsLocalStore.load();
		controller.palmSaleItemsLocalStore.sync();
		controller.palmSalesLocalStore.sync();
		
		var palmSale=r.getData();
		palmSale.sale_items=saleItems;
		
		controller.syncPalmSale(palmSale);
	},
	
	loadGoods: function(){
		var controller = this;

		controller.mainContainer.setLoading(true);
		controller.goodsStore.proxy.clear();
		Ext.Ajax.request({
			url: '/new_mag/get_goods',
			timeout: 300000,
			success: function(response){
				var data = eval('('+response.responseText+')');
				controller.goodsStore.add(data);
				controller.goodsStore.each(function(record){
					record.setDirty();
				});
				
				controller.goodsStore.sync({
					success: function(){
						Ext.Msg.alert('', 'Остатки и цены успешно обновлены');
						controller.mainContainer.setLoading(false);
					},
					failure: controller.showServerError
				});
			},
			failure: controller.showServerError
		});
	},
	
	palmSaleSelect: function(r, print){
		var controller=this;
		controller.palmSaleItemsStore.removeAll();
					
		if(r != null){
			Ext.getCmp('palmSaleOrderItemsTable').setLoading(true);
			
			if(r.get('id') < 0){
				controller.palmSaleItemsLocalStore.data.each(function(record){
					if(record.get('sale_id')==r.get('id')){
						controller.palmSaleItemsStore.add(record);
					}
					return true;
				});
				if(print){
					controller.print('palmSaleOrderItemsTable');
				}
				Ext.getCmp('palmSaleOrderItemsTable').setLoading(false);
			} else {
				Ext.Ajax.request({
					url: '/new_mag/palm_sale_items',
					timeout: 300000,
					method: 'GET',
					params: {
						sale_id: r.get('id')
					},
					callback: function(options, success, response){
						if(success===true){
							var data = eval('('+response.responseText+')');
							controller.palmSaleItemsStore.add(data);
							
							controller.palmSaleItemsStore.each(function(record){
								var isGood=record.get('goods_id')>0;
								record.set('is_good', isGood);
								
								controller.goodsStore.each(function(recGoods){
									var match=false;
									if( (isGood ? recGoods.get('id') : recGoods.get('bad_goods_id')) == record.get('goods_id')){
										record.set('barcode', recGoods.get('barcode'));
										record.set('name', isGood ? recGoods.get('good_goods_name') : recGoods.get('bad_goods_name'));
										
										match=true;
									}
									
									return !match;
								});
								
								return true;
							});
							
							if(print){
								controller.print('palmSaleOrderItemsTable');
							}
						} else {
							controller.showServerError(response);
						}
						Ext.getCmp('palmSaleOrderItemsTable').setLoading(false);
					}
				});
			}
		}
	},
	
	print: function(cmpId){
		Ext.ux.grid.Printer.printAutomatically=true;
		Ext.ux.grid.Printer.closeAutomaticallyAfterPrint=false;
		Ext.ux.grid.Printer.extraCSS=['/ext/examples/ux/css/CheckHeader.css'];
		Ext.ux.grid.Printer.print(Ext.getCmp(cmpId));
	},
	
    init: function() {
		var controller = this;
		
		this.control({
            '#palmSaleItemReadCode': {
                keypress: function(field, e, eOpts ){
					if(e.getKey()==Ext.EventObject.ENTER){
						if(field.value==null) {
							return;
						}
						var val=field.value;
						var isGood = val.length>1 && val[0]=='*';
						val = isGood? val.substr(1, val.length-1) : val;
						
						var 
							palmGoods=controller.currentPalmSaleItemsLocalStore.data.findBy(function(record){
								return (record.get('barcode')==val && record.get('is_good')==isGood);
							});
						
						field.setValue('');
						
						//если товар уже есть в заказе
						if(palmGoods!=null){
							if(!controller.makePalmItemVolume(palmGoods, palmGoods.get('volume') + 1)){
								field.markInvalid(controller.noRemains);
							}
						}
						//если нет, то надо добавить в заказ из имеющихся в наличии
						else
						{
							var selectedGoods=controller.goodsStore.data.filterBy(function(record){
									return (record.get('barcode')==val && record.get('volume')>0);
								});
							
							if(selectedGoods!=null && selectedGoods.length!=0){
								selectedGoods.sortBy(function(a, b){
									return (a.get('price')>b.get('price'))? 1 : (a.get('price') == b.get('price')? 0 : -1);
								});
								
								var sel=selectedGoods.getAt(0);
								
								var r = Ext.ModelManager.create({
									barcode	: sel.get('barcode'),
									goods_id: (isGood || (sel.get('bad_goods_id') == null || sel.get('bad_goods_id') == 0))?
										sel.get('id') :
										sel.get('bad_goods_id'),
									name	: (isGood || (sel.get('bad_goods_name') == null || sel.get('bad_goods_name').length == 0))?
										sel.get('good_goods_name') :
										sel.get('bad_goods_name'),
									price	: isGood? sel.get('good_price') : sel.get('bad_price'),
									volume	: 1,
									cost	: isGood? sel.get('good_price') : sel.get('bad_price'),
									sale_id	: null,
									is_good	: isGood
								}, 'app.model.mag.palmSaleItemModel');
								
								sel.set('volume', sel.get('volume') - 1);
								
								controller.currentPalmSaleItemsLocalStore.add(r);
								controller.currentPalmSaleItemsLocalStore.sync();
								
								controller.goodsStore.sync();
							} else {
								field.markInvalid(controller.noRemains);
							}
						}
					}
						
					return true;
				}
            },
			'#saveCurrentPalmSale': {
				click: function(button, e, eOpts){
					controller.saveCurrentPalmSale();
					
					return true;
				}
			},
			'#savePrintCurrentPalmSale': {
				click: function(button, e, eOpts){
					controller.print('currentPalmSaleTable');
					
					controller.saveCurrentPalmSale();
					
					return true;
				}
			},
			'#filterPalmSales': {
				click: function(button, e, eOpts){
					Ext.getCmp('palmSaleOrdersTable').setLoading(true);
					Ext.getCmp('palmSaleOrderItemsTable').setLoading(true);
					
					controller.palmSalesStore.removeAll();
					
					controller.palmSalesLocalStore.data.each(function(record){
						if(
							record.get('ddate')>=Ext.getCmp('startDate').getValue() &&
							record.get('ddate')<=Ext.getCmp('endDate').getValue()){
							controller.palmSalesStore.add(record);
						}
						return true;
					});
					
					Ext.Ajax.request({
						url: '/new_mag/palm_sales_get',
						timeout: 300000,
						method: 'GET',
						params: {
							ddateb: Ext.getCmp('startDate').getValue(),
							ddatee: Ext.getCmp('endDate').getValue()
						},
						callback: function(options, success, response){
							if(success===true){
								var data = eval('('+response.responseText+')');
								controller.palmSalesStore.add(data);
							} else {
								controller.showServerError(response);
							}
							Ext.getCmp('palmSaleOrdersTable').setLoading(false);
							Ext.getCmp('palmSaleOrderItemsTable').setLoading(false);
						}
					});
					
					return true;
				}
			},
			'#palmSaleOrdersTable': {
				selectionchange: function(sm, selected, eOpts){
					var r=selected[0];
					
					controller.palmSaleSelect(r, false);
					
					return true;
				}
			},
			'#refreshGoods': {
				click: function(button, e, eOpts){
					controller.loadGoods();
				}
			},
			'#syncPalmSales': {
				click: function(button, e, eOpts){
					button.setDisabled(true);
					button.setText('Заказы синхронизируются, подождите');
					controller.requestsRemains=controller.palmSalesLocalStore.getCount();
					
					controller.palmSalesLocalStore.each(function(r){
						var palmSale=r.getData(),
							saleItems=[];
						
						controller.palmSaleItemsLocalStore.each(function(record){
							if(record.get('sale_id')==palmSale.id){
								saleItems.push(record.getData());
							}
							return true;
						});
						
						palmSale.sale_items=saleItems;
						
						controller.syncPalmSale(palmSale);
					});
				}
			}
        });
	},
	
	onLaunch: function(){
		var controller = this,
			cellEditingPalmSale = Ext.getCmp('currentPalmSaleTable').getPlugin('cellEditingPalmSale');

		Ext.tip.QuickTipManager.init();
		Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
			maxWidth: 200,
			minWidth: 100
		});
		
		cellEditingPalmSale.addListener(
			'validateedit',
			function(editor, e, eOpts ){
				var v = editor.getEditor(e.record, e.column).getValue(),
					noError=controller.makePalmItemVolume(e.record, v)
					
				if(noError){
					Ext.tip.QuickTipManager.getQuickTip().hide();
				} else {
					e.cancel = true;
					Ext.tip.QuickTipManager.register({
						target: e.row,
						title: 'Ошибка',
						text: controller.noRemains,
						width: 100,
						autoHide: false
					});
				}
			}
		);
		
		//ХАРДКОД НОМЕРА КОЛОНКИ!!! колонка удаления позиции в таблице текущего заказа
		Ext.getCmp('currentPalmSaleTable').columns[6].handler=function(view, rowIndex, colIndex) {
			var currentRecord=view.store.getAt(rowIndex);
			cellEditingPalmSale.cancelEdit();
			
			controller.makePalmItemVolume(currentRecord, 0);
			
			controller.currentPalmSaleItemsLocalStore.remove(currentRecord);
			controller.currentPalmSaleItemsLocalStore.sync();
		};
		
		//ХАРДКОД НОМЕРА КОЛОНКИ!!! колонка печати заказа в таблице заказов
		Ext.getCmp('palmSaleOrdersTable').columns[3].handler=function(view, rowIndex, colIndex) {
			var
				sel=Ext.getCmp('palmSaleOrdersTable').getSelectionModel().getSelection(),
				current=view.store.getAt(rowIndex);
				
			if(sel!=null && sel[0].get('id')!=current.get('id') ){
				controller.palmSaleSelect(current, true);
			} else {
				print('palmSaleOrderItemsTable');
			}
		};
		
		controller.currentPalmSaleItemsLocalStore = controller.getAppStoreMagCurrentPalmSaleItemsLocalStore();
		
		controller.palmSaleItemsLocalStore = controller.getAppStoreMagPalmSaleItemsLocalStore();
		controller.palmSalesLocalStore = controller.getAppStoreMagPalmSalesLocalStore();
		
		controller.palmSaleItemsStore = controller.getAppStoreMagPalmSaleItemsStore();
		controller.palmSalesStore = controller.getAppStoreMagPalmSalesStore();
		
		controller.goodsStore = controller.getAppStoreMagGoodsStore();
		
		controller.mainContainer = Ext.getCmp('mainContainer');
		
		controller.goodsStore.load(function(records, operation, success) {
			if(controller.goodsStore.data.length<1){
				controller.loadGoods();
			}
		});
		
		controller.currentPalmSaleItemsLocalStore.load();
		controller.palmSaleItemsLocalStore.load();
		controller.palmSalesLocalStore.load();
		
		controller.salesToSync=controller.palmSalesLocalStore.getCount();
		
		Ext.getCmp('currentPalmSaleTable').reconfigure(controller.currentPalmSaleItemsLocalStore);
		Ext.getCmp('palmSaleOrdersTable').reconfigure(controller.palmSalesStore);
		Ext.getCmp('palmSaleOrderItemsTable').reconfigure(controller.palmSaleItemsStore);
		Ext.getCmp('goodsTable').reconfigure(controller.goodsStore);
	}
});