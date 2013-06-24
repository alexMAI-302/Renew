Ext.define('app.controller.TermDelivery.MakeAutoCommonSetup', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'TermDelivery.MakeAutoCommonSetup.Zones',
		'TermDelivery.MakeAutoCommonSetup.Terminals'
	],
	
	models: [
		'valueModel'
	],
	
	views: [
		'TermDelivery.MakeAutoCommonSetup.Container'
	],
	
	mainContainer: null,
	
	zonesStore: null,
	terminalsStore: null,
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.TermDelivery.MakeAutoCommonSetup.Container');
		
		controller.control({
			'#saveTerminals': {
				click: function(){
					controller.terminalsStore.sync();
				}
			},
			'#filterTerminals': {
				click: function(){
					controller.terminalsStore.proxy.extraParams={
						zone_id: Ext.getCmp('filterZoneCommon').getValue(),
						str: Ext.getCmp('filterStrCommon').getValue()
					};
					controller.terminalsStore.load(
						function(records, operation, success){
							if(!success){
								Ext.Msg.alert("Ошибка", "Ошибка при загрузке терминалов");
							}
							controller.mainContainer.setLoading(false);
						}
					);
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.terminalsStore=Ext.getCmp('TerminalsTable').getStore();
		controller.zonesStore=Ext.getCmp('filterZoneCommon').store;
		
		controller.zonesStore.proxy.extraParams={
			zone_type: 0
		};
		controller.zonesStore.load();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});