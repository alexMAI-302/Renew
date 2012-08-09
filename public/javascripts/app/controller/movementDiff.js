Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
    'Ext.ux.CheckColumn'
]);
Ext.define('app.controller.movementDiff', {
    extend: 'Ext.app.Controller',
	stores: [
		'movementDiff.actionTypeStore',
		'movementDiff.movementDiffStore',
		'movementDiff.ndocsSOClearStore',
		'movementDiff.ndocsSupClearStore',
		'movementDiff.sitesDestClearStore',
		'movementDiff.sitesSrcClearStore',
		'movementDiff.sitesStore'
	],
	
	models: [
		'valueModel',
		'movementDiff.movementDiffModel'
	],
	
	views: [
		'movementDiff.MainContainer'
	],
	
	sitesStore: null,
	
	sitesRenderer: function(value){
		var matching=null;
		sitesStore.each(function(record){
			if(record.get('id')==value){
				matching=record.get('name');
			}
			return !matching;
		});
		return matching;
	},
	
	onActionComboEvent: function(field){
		if(field.getValue() != null){
			field.ownerCt.down('#clearDiff').show();
		}
	},
	
	loadMovementDiff: function(){
		var ddateb = new Date(filterPanel.down('#startDate').getValue());
		var ddatee = new Date(filterPanel.down('#endDate').getValue());
		var siteFrom = filterPanel.down('#siteFrom').getValue();
		var siteTo = filterPanel.down('#siteTo').getValue();
		
		controller.mainContainer.setLoading(true);

		controller.movementDiffStore.proxy.extraParams={
			ddateb: Ext.Date.format(ddateb, 'Y-m-d'),
			ddatee: Ext.Date.format(ddatee, 'Y-m-d'),
			site_from: siteFrom,
			site_to: siteTo
		};
		
		controller.movementDiffStore.load(
			function(records, operation, success){
				if(success){
					var siteSrcArray=movementDiffStore.collect('site_src_id'),
						siteDestArray=movementDiffStore.collect('site_dest_id'),
						ndocSOArray=movementDiffStore.collect('ndoc_so'),
						ndocSupArray=movementDiffStore.collect('ndoc_sup');
					var ndocSO, ndocSup;
						
					controller.sitesSrcClearStore.removeAll();
					controller.sitesDestClearStore.removeAll();
					controller.ndocsSOClearStore.removeAll();
					controller.ndocsSupClearStore.removeAll();
					
					sitesStore.each(function(record){
						for(var i=0; i<siteSrcArray.length; i++){
							if(record.get('id')==siteSrcArray[i] || record.get('id')==-1){
								sitesSrcClearStore.add(record);
							}
						}
						return true;
					});
					
					sitesStore.each(function(record){
						for(var i=0; i<siteDestArray.length; i++){
							if(record.get('id')==siteDestArray[i] || record.get('id')==-1){
								sitesDestClearStore.add(record);
							}
						}
						return true;
					});
					
					for(var i=0; i<ndocSOArray.length; i++){
						ndocSO = Ext.ModelManager.create({
							id	: ndocSOArray[i],
							name: ndocSOArray[i]
						}, 'app.model.valueModel');
						controller.ndocsSOClearStore.add(ndocSO);
					}
					
					for(var i=0; i<ndocSupArray.length; i++){
						ndocSup = Ext.ModelManager.create({
							id	: ndocSupArray[i],
							name: ndocSupArray[i]
						}, 'app.model.valueModel');
						controller.ndocsSupClearStore.add(ndocSup);
					}
					
					movementDiffContainer.setDisabled(false);
					mainContainer.setLoading(false);
				}
			});
		},
	
    init: function() {
		var controller = this;
		
		controller.mainContainer = Ext.create('app.view.movementDiff.MainContainer');
		
		controller.control({
			'selectedDiffs': {
				"checkchange": function(){
					if(movementDiffStore.collect('to_clear').length>1){
						movementDiffPanel.down('#clearDiff').show();
					} else {
						movementDiffPanel.down('#clearDiff').hide();
					}
				}
			},
			'actionType' : {
				"change": function(field, newValue, oldValue, eOpts){
					field.ownerCt.items.each(function(i){
						i.hide();
					});
					movementDiffPanel.down('#selectedDiffs').hide();
					field.ownerCt.down('#actionType').show();
					switch(newValue){
						case 1:
							field.ownerCt.down('#siteSrcAction').show();
						break;
						case 2:
							field.ownerCt.down('#siteDestAction').show();
						break;
						case 3:
							field.ownerCt.down('#ndocSOAction').show();
						break;
						case 4:
							field.ownerCt.down('#ndocSupAction').show();
						break;
						case 5:
							movementDiffPanel.down('#selectedDiffs').show();
							if(newValue==5){
								//если больше одного уникального значения, т.е. если есть выбранные для списания позиции
								if(movementDiffStore.collect('to_clear').length>1){
									field.ownerCt.down('#clearDiff').show();
								}
							}
						break;
					}
				}
			},
			'siteSrcAction, siteDestAction, ndocSOAction, ndocSupAction': {
				"show": controller.onActionComboEvent,
				"change": controller.onActionComboEvent
			},
			'#clearDiff': {
				"click": function(button, e){
					var siteSrc, siteDest, ndocSO, ndocSup, ids = null;
					var ddateb = new Date(filterPanel.down('#startDate').getValue()),
						ddatee = new Date(filterPanel.down('#endDate').getValue());
					
					switch(button.ownerCt.down('#actionType')){
						case 1:
							siteSrc = button.ownerCt.down('#siteSrcAction').getValue;
						break;
						case 2:
							siteDest = button.ownerCt.down('#siteDestAction').getValue;
						break;
						case 3:
							ndocSO = button.ownerCt.down('#ndocSOAction').getValue;
						break;
						case 4:
							ndocSup = button.ownerCt.down('#ndocSupAction').getValue;
						break;
						case 5:
							movementDiffStore.each(function(record){
								if(record.get('to_clear')){
									ids.push(record.get('id'));
								}
								return true;
							});
						break;
					}
					
					mainContainer.setLoading(true);
					Ext.Ajax.request({
						params:{
							authenticity_token: window._token,
							site_src: siteSrc,
							site_dest: siteDest,
							ndoc_so: ndocSO,
							ndoc_sup: ndocSup,
							ids: ids.toString(),
							ddateb: Ext.Date.format(ddateb, 'Y-m-d'),
							ddatee: Ext.Date.format(ddatee, 'Y-m-d')
						},
						method: 'post',
						url: '/movement_diff/clear_diff',
						success: function(response){
							loadMovementDiff();
						}
					});
				}
			},
			'#filter': {
				'click': loadMovementDiff
			}
		});
		
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		}
		
		Ext.Ajax.request.failure = showServerError;
	},
	
	onLaunch: function(){
		var controller = this;
		
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
				
			if(sel!=null && (sel[0]==null || sel[0].get('id')!=current.get('id')) ){
				controller.palmSaleSelect(current, true);
			} else {
				print('palmSaleOrderItemsTable');
			}
		};
		
		controller.sitesStore = controller.getSitesStore();
		
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
		
		Ext.getCmp('siteFrom').bindStore(controller.sitesStore);
		Ext.getCmp('siteTo').bindStore(controller.sitesStore);
		Ext.getCmp('palmSaleOrderItemsTable').reconfigure(controller.palmSaleItemsStore);
		Ext.getCmp('goodsTable').reconfigure(controller.goodsStore);
	}
});