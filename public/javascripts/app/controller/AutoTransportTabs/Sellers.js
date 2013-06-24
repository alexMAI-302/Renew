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
	masterStore: null,
	
	refreshSellers: function(){
		var controller=this;
		
		controller.masterStore.load(
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
					controller.sync(
						controller.masterStore,
						controller.sellersContainer);
					return true;
				}
			},
			'#SellersTable': {
				selectionchange: function(sm, selected, eOpts){
					Ext.getCmp('deleteSellers').setDisabled(selected==null || selected.length==0);
					return true;
				}
			},
			'#addSellers':{
				click: function(){
					var r = Ext.ModelManager.create({}, 'app.model.valueModel');
					controller.masterStore.add(r);
				}
			},
			'#refreshSellers': {
				click: controller.refreshSellers
			},
			'#deleteSellers': {
				click: function(button){
					var sm = Ext.getCmp('SellersTable').getSelectionModel();
					
					controller.masterStore.remove(sm.getSelection()[0]);
					if (controller.masterStore.getCount() > 0) {
						sm.select(0);
					}
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore=controller.getAutoTransportSellersStore();
		
		controller.refreshSellers();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});