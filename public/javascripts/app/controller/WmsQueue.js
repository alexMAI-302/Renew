Ext.define('app.controller.WmsQueue', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'WmsQueue.WmsQueueEntries'
	],
	
	views: [
		'WmsQueue.Container'
	],
	
	mainContainer: null,
	masterStore: null,
	
	refreshWmsQueue: function(){
		var controller=this;
		
		controller.masterStore.proxy.extraParams = {
			ddateb: Ext.getCmp('ddatebWmsQueue').getValue(),
			ddatee: Ext.getCmp('ddateeWmsQueue').getValue(),
			request: Ext.getCmp('filterRequestWmsQueue').getValue(),
			reply: Ext.getCmp('filterReplyWmsQueue').getValue(),
			result: Ext.getCmp('filterResultWmsQueue').getValue()
		};
		
		controller.masterStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке записей таблицы");
				}
			}
		);
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.WmsQueue.Container');
		
		controller.control({
			'#SellersTable': {
				selectionchange: function(sm, selected, eOpts){
					Ext.getCmp('deleteSellers').setDisabled(selected==null || selected.length==0);
					return true;
				}
			},
			'#filterWmsQueue': {
				click: controller.refreshWmsQueue
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore=controller.getWmsQueueWmsQueueEntriesStore();
		
		controller.refreshWmsQueue();
	},
	
	bindStores: function(){
		var controller=this;
		
		Ext.getCmp('WmsQueueTable').reconfigure(controller.masterStore);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
	}
});