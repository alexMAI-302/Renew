Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
	'Ext.ux.grid.Printer'
]);
Ext.define('app.controller.mag', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'mag.goods',
		'mag.currentPalmSaleItemsLocal',
		'mag.palmSaleItemsLocal',
		'mag.palmSalesLocal',
		'mag.palmSaleItems',
		'mag.palmSales'
	],
	
	models: [
		'valueModel',
		'mag.goodsModel',
		'mag.palmSaleModel',
		'mag.palmSaleItemModel'
	],
	
	views: [
		'mag.MainContainer',
		'mag.magTabs',
		'mag.currentPalmSaleOrder.Grid'
	],
	
	mainContainer: null,
	
	noRemains: 'Не хватает остатков',
	
	currentPalmSaleItemsLocalStore: null,
	
	palmSaleItemsLocalStore: null,
	palmSalesLocalStore: null,
	
	palmSaleItemsStore: null,
	palmSalesStore: null,
	
	goodsStore: null,
	
	salesToSync: 0,
	requestsRemains: 0,
	
	showServerError: function(responseText) {
		Ext.Msg.alert('Ошибка', responseText);
	},
	
	makePalmItemVolume: function(
		palmGoods,
		volume
	){
		var controller = this;
		var storageGoods=controller.goodsStore.data.findBy(function(record){
			return (
				record.get('barcode') == palmGoods.get('barcode') &&
				record.get('is_good') == palmGoods.get('is_good') &&
				(palmGoods.get('volume') + record.get('volume')) >= volume
			);
		});
		
		//если есть достаточное количество остатка товара, то меняем количетсво в позиции заказа и остаток
		if(storageGoods!=null && storageGoods.get('id') != 0){
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
	
	removeLocalPalmSale: function(controller, palmSaleId){
		var i=0, record;
		while(i < controller.palmSaleItemsLocalStore.getCount()){
			record = controller.palmSaleItemsLocalStore.getAt(i);
			if(record.get('sale_id') == palmSaleId){
				controller.palmSaleItemsLocalStore.remove(record);
			} else {
				i++;
			}
		};
		if(controller.palmSaleItemsLocalStore.getCount() == 0){
			controller.palmSaleItemsLocalStore.proxy.clear();
		}
		
		controller.palmSalesLocalStore.each(function(r){
			if(r.get('id')==palmSaleId){
				controller.palmSalesLocalStore.remove(r);
				return false;
			} else {
				return true;
			}
		});
		if(controller.palmSalesLocalStore.getCount() == 0){
			controller.palmSalesLocalStore.proxy.clear();
		}
		
		controller.palmSalesLocalStore.sync();
		controller.palmSaleItemsLocalStore.sync();
		controller.salesToSync--;
	},
	
	syncPalmSale: function(palmSale){
		var controller=this;
		
		Ext.Ajax.request({
			url: '/new_mag/palm_sale',
			timeout: 300000,
			jsonData: {
				palm_sale: palmSale
			},
			method: "POST",
			callback: function(options, success, response){
				if(success===true){
					controller.removeLocalPalmSale(controller, palmSale.id);
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
			sumTotal = 0,
			saleItems=[],
			r = Ext.ModelManager.create({
				ddate: Ext.Date.format(new Date(), 'Y-m-d H:i:s')
			}, 'app.model.mag.palmSaleModel');
		
		controller.palmSalesLocalStore.add(r);
		controller.palmSalesLocalStore.sync();
		
		controller.currentPalmSaleItemsLocalStore.each(function(record){
			var current = Ext.ModelManager.create({
					barcode	: record.get('barcode'),
					goods_id: record.get('goods_id'),
					name	: record.get('name'),
					price	: record.get('price'),
					volume	: record.get('volume'),
					cost	: record.get('cost'),
					sale_id	: r.get('id'),
					is_good	: record.get('is_good')
				}, 'app.model.mag.palmSaleItemModel');
			
			sumTotal += current.get('cost');
			
			controller.palmSaleItemsLocalStore.add(current);
			saleItems.push(current.getData());
			
			return true;
		});
		r.set('sumtotal', sumTotal);
		
		controller.palmSalesLocalStore.sync();
		controller.palmSaleItemsLocalStore.sync();
		
		controller.salesToSync++;

		controller.currentPalmSaleItemsLocalStore.proxy.clear();
		controller.currentPalmSaleItemsLocalStore.load();
		
		var palmSale=r.getData();
		palmSale.sale_items=saleItems;
		
		controller.syncPalmSale(palmSale);
	},
	
	loadGoods: function(){
		var controller = this;

		controller.mainContainer.setLoading(true);
		localStorage.removeItem('unactmag-goods');
		Ext.Ajax.request({
			url: '/new_mag/get_goods',
			timeout: 300000,
			success: function(response){
				try
				{
					var data = eval('('+response.responseText+')');
					controller.goodsStore.loadData(data);
					localStorage.setItem('unactmag-goods', response.responseText);
				
					 Ext.Msg.alert('', 'Остатки и цены успешно обновлены');
				} catch(e) {
					Ext.Msg.alert('Ошибка', 'При обновлении остатков произошла ошибка, попробуйте еще раз.');
				}
				controller.mainContainer.setLoading(false);
			},
			failure: function(response){
				controller.showServerError(response.responseText);
				controller.mainContainer.setLoading(false);
			}
		});
	},
	
	palmSaleSelect: function(r, print){
		var controller=this,
			palmSaleOrderItemsTable = Ext.getCmp('PalmSaleOrderItemsTable');
		controller.palmSaleItemsStore.removeAll();
					
		if(r != null){
			palmSaleOrderItemsTable.setLoading(true);
			if(r.get('id') < 0){
				controller.palmSaleItemsLocalStore.data.each(function(record){
					if(record.get('sale_id')==-r.get('id')){
						controller.palmSaleItemsStore.add(record);
					}
					return true;
				});
				if(print){
					controller.print('PalmSaleOrderItemsTable');
				}
				palmSaleOrderItemsTable.setLoading(false);
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
								
								controller.goodsStore.each(function(recGoods){
									var match=false;
									if( (record.get('is_good') == true ? recGoods.get('id') : recGoods.get('bad_goods_id')) == record.get('goods_id')){
										record.set('barcode', recGoods.get('barcode'));
										record.set('name', recGoods.get('goods'));
										
										match=true;
									}
									
									return !match;
								});
								
								return true;
							});
							
							if(print){
								controller.print('PalmSaleOrderItemsTable');
							}
						} else {
							controller.showServerError(response.responseText);
						}
						Ext.getCmp('PalmSaleOrderItemsTable').setLoading(false);
					}
				});
			}
		}
	},
	
	filterPalmSales: function(button, e, eOpts){
		var controller = this,
			palmSaleOrdersTable = Ext.getCmp('PalmSaleOrdersTable'),
			palmSaleOrderItemsTable = Ext.getCmp('PalmSaleOrderItemsTable'),
			ddateb=Ext.getCmp('ddatebPalmSales').getValue(),
			ddatee=Ext.getCmp('ddateePalmSales').getValue(),
			ddatee1=Ext.Date.add(ddatee, Ext.Date.DAY, 1);
		
		
		palmSaleOrdersTable.setLoading(true);
		palmSaleOrderItemsTable.setLoading(true);
		
		controller.palmSalesStore.removeAll();
		
		controller.palmSalesLocalStore.data.each(function(record){
			if(
				record.get('ddate')>=ddateb &&
				record.get('ddate')<=ddatee1
			){
					var r = {
							id: -record.get('id'),
							ddate: Ext.Date.format(record.get('ddate'), 'Y-m-d H:i:s'),
							sumtotal: record.get('sumtotal')
						};
				controller.palmSalesStore.add(r);
			}
			return true;
		});
		
		Ext.Ajax.request({
			url: '/new_mag/palm_sales_get',
			timeout: 300000,
			method: 'GET',
			params: {
				ddateb: ddateb,
				ddatee: ddatee
			},
			callback: function(options, success, response){
				if(success===true){
					var data = eval('('+response.responseText+')');
					controller.palmSalesStore.add(data);
					palmSaleOrdersTable.view.refresh();
				} else {
					controller.showServerError(response.responseText);
				}
				palmSaleOrdersTable.setLoading(false);
				palmSaleOrderItemsTable.setLoading(false);
			}
		});
		
		return true;
	},
	
	print: function(cmpId){
		var grid=Ext.getCmp(cmpId);
		Ext.ux.grid.Printer.printAutomatically=true;
		Ext.ux.grid.Printer.closeAutomaticallyAfterPrint=true;
		Ext.ux.grid.Printer.extraCSS=['/ext/resources/css/ext-all.css'];
		Ext.ux.grid.Printer.print(grid, ['barcode', 'is_good'], 'Итого: '+grid.store.sum('cost'));
	},
	
    init: function() {
		var controller = this;
		
		controller.mainContainer = Ext.create('app.view.mag.MainContainer');
		
		this.control({
            '#palmSaleItemReadCode': {
                keypress: function(field, e, eOpts ){
					if(e.getKey()==Ext.EventObject.ENTER){
						var val=field.getValue();
						
						field.setValue('');
						
						if(val==null || val=='') {
							return true;
						}
						
						var isGood = val.length>1 && val[0]=='*',
							errorField = Ext.getCmp('errorField');
						val = isGood? val.substr(1, val.length-1) : val;
						var 
							palmGoods=controller.currentPalmSaleItemsLocalStore.data.findBy(
								function(record){
									var match=false, vals=record.get('barcode').split(',');
										for(var i=0; i<vals.length; i++){
											if(vals[i]==val){
												match=true;
												break;
											}
										}
									return (match && record.get('is_good')==isGood);
								}
							);
						
						//если товар уже есть в заказе
						if(palmGoods!=null){
							if(!controller.makePalmItemVolume(palmGoods, palmGoods.get('volume') + 1)){
								errorField.show();
							} else {
								errorField.hide();
							}
						}
						//если нет, то надо добавить в заказ из имеющихся в наличии
						else
						{
							var selectedGoods=controller.goodsStore.data.filterBy(function(record){
									var match=false, vals=record.get('barcode').split(',');
									for(var i=0; i<vals.length; i++){
										if(vals[i]==val){
											match=true;
											break;
										}
									}
									return (match && isGood==record.get('is_good') && record.get('volume')>0);
								});
							
							if(selectedGoods!=null && selectedGoods.length!=0){
								selectedGoods.sortBy(function(a, b){
									return (a.get('price')>b.get('price'))? 1 : (a.get('price') == b.get('price')? 0 : -1);
								});
								
								var sel=selectedGoods.getAt(0);
								
								var r = Ext.ModelManager.create({
									barcode	: sel.get('barcode'),
									goods_id: sel.get('goods_id'),
									name	: sel.get('name'),
									price	: sel.get('price'),
									volume	: 1,
									cost	: sel.get('price'),
									sale_id	: null,
									is_good	: isGood
								}, 'app.model.mag.palmSaleItemModel');
								
								sel.set('volume', sel.get('volume') - 1);
								controller.currentPalmSaleItemsLocalStore.add(r);
								controller.currentPalmSaleItemsLocalStore.sync();
								
								controller.goodsStore.sync();
								errorField.hide();
							} else {
								errorField.show();
							}
						}
						
						field.focus();
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
					controller.print('CurrentPalmSaleTable');
					
					controller.saveCurrentPalmSale();
					
					return true;
				}
			},
			'#filterPalmSales': {
				click: controller.filterPalmSales
			},
			'#PalmSaleOrdersTable': {
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
			currentPalmSaleTable = Ext.getCmp('CurrentPalmSaleTable'),
			palmSaleOrdersTable = Ext.getCmp('PalmSaleOrdersTable'),
			palmSaleOrderItemsTable = Ext.getCmp('PalmSaleOrderItemsTable'),
			cellEditingPalmSale = currentPalmSaleTable.getPlugin('celleditingCurrentPalmSale'),
			goodsData = eval('('+localStorage.getItem('unactmag-goods')+')');

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
		currentPalmSaleTable.columns[6].handler=function(view, rowIndex, colIndex) {
			var currentRecord=view.store.getAt(rowIndex);
			cellEditingPalmSale.cancelEdit();
			
			controller.makePalmItemVolume(currentRecord, 0);
			
			controller.currentPalmSaleItemsLocalStore.remove(currentRecord);
			controller.currentPalmSaleItemsLocalStore.sync();
		};
		
		//ХАРДКОД НОМЕРА КОЛОНКИ!!! колонка печати заказа в таблице заказов
		palmSaleOrdersTable.columns[4].handler=function(view, rowIndex, colIndex) {
			var
				sel=Ext.getCmp('PalmSaleOrdersTable').getSelectionModel().getSelection(),
				current=view.store.getAt(rowIndex);
				
			if(sel!=null && (sel[0]==null || sel[0].get('id')!=current.get('id')) ){
				controller.palmSaleSelect(current, true);
			} else {
				controller.print('PalmSaleOrderItemsTable');
			}
		};
		
		//ХАРДКОД НОМЕРА КОЛОНКИ!!! колонка удаления заказа в таблице заказов
		palmSaleOrdersTable.columns[5].handler=function(view, rowIndex, colIndex) {
			var palmSaleOrdersTable = Ext.getCmp('PalmSaleOrdersTable'),
				sel=palmSaleOrdersTable.getSelectionModel().getSelection(),
				current=view.store.getAt(rowIndex);
			
			//если заказ нельзя удалять, то не удалять
			if(current.get('closed')){
				return false;
			} else {
			//если можно, то удалить
				//если заказ из локального хранилища, то удалить его из локального хранилища
				if(current.get('id') < 0) {
					controller.removeLocalPalmSale(controller, -current.get('id'));
				}
				//иначе отправить запрос на уделение
				else {
					palmSaleOrdersTable.setLoading(true);
					Ext.Ajax.request({
						url: '/new_mag/palm_sale',
						timeout: 300000,
						method: 'DELETE',
						params: {
							id: current.get('id'),
							authenticity_token: window._token
						},
						callback: function(options, success, response){
							if(success===true){
							} else {
								controller.showServerError(response.responseText);
							}
							palmSaleOrdersTable.setLoading(false);
						}
					});
				}
				
				view.store.remove(current);
				
				if(view.store.getCount()>0){
					palmSaleOrdersTable.getSelectionModel().select(0);
				}
			}
		};
		
		controller.currentPalmSaleItemsLocalStore = controller.getMagCurrentPalmSaleItemsLocalStore();
		
		controller.palmSaleItemsLocalStore = controller.getMagPalmSaleItemsLocalStore();
		controller.palmSalesLocalStore = controller.getMagPalmSalesLocalStore();
		
		controller.palmSaleItemsStore = controller.getMagPalmSaleItemsStore();
		controller.palmSalesStore = controller.getMagPalmSalesStore();
		
		controller.goodsStore = controller.getMagGoodsStore();
		
		try
		{
			controller.goodsStore.loadData(goodsData);
		}
		catch(e)
		{
			localStorage.removeItem('unactmag-goods');
		}
		
		if(controller.goodsStore.getCount()==0){
			controller.loadGoods();
		}
		
		controller.currentPalmSaleItemsLocalStore.load();
		controller.palmSaleItemsLocalStore.load();
		controller.palmSalesLocalStore.load();
		
		controller.salesToSync=controller.palmSalesLocalStore.getCount();
		
		currentPalmSaleTable.reconfigure(controller.currentPalmSaleItemsLocalStore);
		palmSaleOrdersTable.reconfigure(controller.palmSalesStore);
		palmSaleOrderItemsTable.reconfigure(controller.palmSaleItemsStore);
		Ext.getCmp('GoodsTable').reconfigure(controller.goodsStore);
	}
});