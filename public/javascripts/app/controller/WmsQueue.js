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
			result: Ext.getCmp('filterResultWmsQueue').getValue(),
			trans_id: Ext.getCmp('filterTransIdWmsQueue').getValue()
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
		
		controller.masterStore=Ext.getCmp('WmsQueueTable').getStore();
		
		controller.refreshWmsQueue();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});