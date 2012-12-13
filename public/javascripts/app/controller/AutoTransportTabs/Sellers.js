Ext.define('app.controller.AutoTransportTabs.Sellers', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'AutoTransport.Sellers'
	],
	
	models: [
		'valueModel'
	],
	
	views: [
		'AutoTransport.Container',
		'AutoTransport.Sellers.Container'
	],
	
	sellersContainer: null,
	
	nomenclatureStore: null,
	nomenclatureGroupStore: null,
	
	refreshSellers: function(){
		var controller=this;
		
		controller.sellersStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке поставщиков");
				}
				controller.sellersContainer.setLoading(false);
			}
		);
	},
	
	sync: function(masterStore, container){
		if (
			(masterStore.getNewRecords().length > 0) ||
			(masterStore.getUpdatedRecords().length > 0) ||
			(masterStore.getRemovedRecords().length > 0)){
				
			container.setLoading(true);
			masterStore.sync({
				callback: function(batch){
					if(batch.exceptions.length>0){
						Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
					}
					container.setLoading(false);
				}
			});
		}
	},
	
	init: function() {
		var controller = this;
		
		controller.sellersContainer=Ext.create('app.view.AutoTransport.Sellers.Container');
		
		Ext.getCmp('AutoTransportMain').add(controller.sellersContainer);
		
		controller.control({
			'#saveSellers': {
				click: function(){
					var selected=Ext.getCmp('nomenclatureGroupsTable').getSelectionModel().getSelection()[0];
					controller.sync(
						controller.sellersStore,
						controller.sellersContainer);
					return true;
				}
			},
			'#sellersTable': {
				selectionchange: function(sm, selected, eOpts){
					Ext.getCmp('deleteSeller').setDisabled(selected==null || selected.length==0);
					return true;
				}
			},
			'#addSeller':{
				click: function(){
					var r = Ext.ModelManager.create({}, 'app.model.valueModel');
					controller.sellersStore.add(r);
				}
			},
			'#refreshSellers': {
				click: controller.refreshSellers
			},
			'#deleteSeller': {
				click: function(button){
					var sm = Ext.getCmp('sellersTable').getSelectionModel();
					
					controller.sellersStore.remove(sm.getSelection()[0]);
					if (controller.sellersStore.getCount() > 0) {
						sm.select(0);
					}
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.sellersStore=controller.getAutoTransportSellersStore();
		
		controller.refreshSellers();
	},
	
	bindStores: function(){
		var controller=this;
		
		Ext.getCmp('sellersTable').reconfigure(controller.sellersStore);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
	}
});