Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
    'Ext.ux.CheckColumn',
	'Ext.ux.statusbar.StatusBar'
]);
Ext.define('app.controller.mag', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'app.store.mag.goods',
		'app.store.mag.currentPalmSaleItemsLocal'
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
	ready: 'Готово',
	
	currentPalmSaleItemsLocalStore: null,
	goodsStore: null,
	mainContainer: null,
	
	showServerError: function(response, options) {
		Ext.Msg.alert('Ошибка', response.responseText);
		this.mainContainer.setLoading(false);
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
			
			controller.currentPalmSaleItemsLocalStore.sync();
			controller.goodsStore.sync();
			return true;
		} else {
			return false;
		}
	},
	
	loadGoods: function(){
		var controller = this;
		controller.mainContainer.setLoading(true);
		controller.goodsStore.data.clear();
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
			}
		});
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
						
						var palmGoods=controller.currentPalmSaleItemsLocalStore.data.findBy(function(record){
							return (record.get('barcode')==val && record.get('is_good')==isGood);
						});
						
						//если товар уже есть в заказе
						if(palmGoods!=null){
							controller.makePalmItemVolume(palmGoods, palmGoods.get('volume') + 1);
						}
						//если нет, то надо добавить в заказ из имеющихся в наличии
						else
						{
							var
								selectedGoods=controller.goodsStore.data.filterBy(function(record){
									return (record.get('barcode')==val && record.get('volume')>0);
								}),
								sb=Ext.getCmp('palmSaleItemStatusBar');
							
							if(selectedGoods!=null && selectedGoods.length!=0){
								selectedGoods.sortBy(function(a, b){
									return (a.get('price')>b.get('price'))? 1 : (a.get('price') == b.get('price')? 0 : -1);
								});
								
								var sel=selectedGoods.getAt(0);
								
								var r = Ext.ModelManager.create({
									barcode	: sel.get('barcode'),
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
								
								sb.setStatus({text: controller.ready});
							} else {
								sb.setStatus({text: controller.noRemains});
							}
						}
						
						field.setValue('');
					}
						
					return true;
				}
            },
			'': function(){
				
			}
        });
	},
	
	onLaunch: function(){
		var controller = this,
			cellEditingPalmSale = Ext.getCmp('currentPalmSaleTable').getPlugin('cellEditingPalmSale');
		
		cellEditingPalmSale.addListener(
			'validateedit',
			function(editor, e, eOpts ){
				var v = editor.getEditor(e.record, e.column).getValue(),
					sb=Ext.getCmp('palmSaleItemStatusBar'),
					noError=controller.makePalmItemVolume(e.record, v);

				if(noError){
					sb.setStatus({text: controller.ready});
				} else {
					e.cancel = true;
					sb.setStatus({text: controller.noRemains});
				}
			}
		);
		
		//ХАРДКОД НОМЕРА КОЛОНКИ!!! колонка удаления позиции
		Ext.getCmp('currentPalmSaleTable').columns[5].handler=function(view, rowIndex, colIndex) {
			var currentRecord=view.store.getAt(rowIndex);
			cellEditingPalmSale.cancelEdit();
			
			controller.makePalmItemVolume(currentRecord, 0);
			
			controller.currentPalmSaleItemsLocalStore.remove(currentRecord);
			controller.currentPalmSaleItemsLocalStore.sync();
		};
		
		controller.currentPalmSaleItemsLocalStore = controller.getAppStoreMagCurrentPalmSaleItemsLocalStore();
		controller.goodsStore = controller.getAppStoreMagGoodsStore();
		controller.mainContainer = controller.getAppViewMainContainerView();
		
		controller.goodsStore.load(function(records, operation, success) {
			if(controller.goodsStore.data.length<1){
				controller.loadGoods();
			}
		});
		
		controller.currentPalmSaleItemsLocalStore.load();
		
		Ext.getCmp('currentPalmSaleTable').reconfigure(controller.currentPalmSaleItemsLocalStore);
		Ext.getCmp('goodsTable').reconfigure(controller.goodsStore);
	}
});