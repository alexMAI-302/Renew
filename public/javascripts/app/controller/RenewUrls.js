Ext.define('app.controller.RenewUrls', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'renewUrls.RenewUrls',
		'renewUrls.RenewUrlTypes'
	],
	
	models: [
		'valueModel',
		'renewUrls.RenewUrlModel'
	],
	
	views: [
		'renewUrls.Container'
	],
	
	mainContainer: null,
	
	renewUrlTypesStore: null,
	masterStore: null,
	
	storeHasChanges: function(store){
		return (store.getNewRecords().length > 0) ||
			(store.getUpdatedRecords().length > 0) ||
			(store.getRemovedRecords().length > 0)
	},
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	syncMaster: function(container, selectedMasterId){
		var controller=this;
		
		if (controller.storeHasChanges(controller.masterStore)){
				
			container.setLoading(true);
			controller.masterStore.sync({
				callback: function(batch){
					if(batch.exceptions.length>0){
						Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
						container.setLoading(false);
					}
					container.setLoading(false);
				}
			});
		}
	},
	
	refreshMaster: function(){
		var controller = this;
		
		controller.masterStore.proxy.extraParams = {
			url_type_id: Ext.getCmp('filterRenewUrlTypeRenewUrls').getValue()
		};
		controller.masterStore.load(
			function(records, operation, success){
				if(success!==true){
					Ext.Msg.alert('Ошибка', "Ошибка при загрузке шаблонов");
				}
			}
		);
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.renewUrls.Container');
		
		controller.control({
			'#RenewUrlsTable': {
				selectionchange: function(sm, selected, eOpts){
					Ext.getCmp('deleteRenewUrls').setDisabled(selected==null || selected.length==0);
					return true;
				}
			},
			'#refreshRenewUrls': {
				click: controller.refreshMaster
			},
			'#saveRenewUrls': {
				click: function(){
					var selected=Ext.getCmp('RenewUrlsTable').getSelectionModel().getSelection()[0];
					controller.syncMaster(
						controller.mainContainer,
						(selected!=null)?selected.get('id'):null);
					return true;
				}
			},
			'#deleteRenewUrls': {
				click: function(button){
					var sm = Ext.getCmp('RenewUrlsTable').getSelectionModel();
					
					controller.masterStore.remove(sm.getSelection()[0]);
					if (controller.masterStore.getCount() > 0) {
						sm.select(0);
					}
				}
			},
			'#addRenewUrls': {
				click: function(){
					var sm=Ext.getCmp('RenewUrlsTable').getSelectionModel(),
						r = Ext.ModelManager.create(
							{url_type_id: Ext.getCmp('filterRenewUrlTypeRenewUrls').getValue()},
							'app.model.renewUrls.RenewUrlModel'
						);
					controller.masterStore.insert(0, r);
					sm.select(r);
				}
			}
		});
	},
	
	loadDictionaries: function(){
		var controller=this;
		
		controller.renewUrlTypesStore.load(
			function(records, operation, success){
				if(success===true){
					controller.refreshMaster();
				} else {
					Ext.Msg.alert('Ошибка', "Ошибка при загрузке списка типов шаблонов");
				}
			}
		);
	},
	
	initStores: function(){
		var controller=this,
			renewUrlsTable = Ext.getCmp('RenewUrlsTable');
		
		controller.masterStore = renewUrlsTable.getStore();
		controller.renewUrlTypesStore = renewUrlsTable.columns[2].store;
		
		controller.loadDictionaries();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});