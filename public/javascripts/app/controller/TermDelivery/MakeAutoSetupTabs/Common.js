Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
    'Ext.ux.CheckColumn'
]);
Ext.define('app.controller.TermDelivery.MakeAutoSetupTabs.Common', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'TermDelivery.MakeAutoSetup.Zones',
		'TermDelivery.MakeAutoSetup.Terminals'
	],
	
	models: [
		'valueModel'
	],
	
	views: [
		'TermDelivery.MakeAutoSetup.Container',
		'TermDelivery.MakeAutoSetup.Common.Container'
	],
	
	terminalsContainer: null,
	
	zonesStore: null,
	terminalsStore: null,
	
	init: function() {
		var controller = this;
		
		controller.terminalsContainer=Ext.create('app.view.TermDelivery.MakeAutoSetup.Common.Container');
		
		Ext.getCmp('MakeAutoSetupMain').add(controller.terminalsContainer);
		
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
							controller.terminalsContainer.setLoading(false);
						}
					);
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.terminalsStore=controller.getTermDeliveryMakeAutoSetupTerminalsStore();
		controller.zonesStore=controller.getTermDeliveryMakeAutoSetupZonesStore();
	},
	
	bindStores: function(){
		var controller=this;
		
		Ext.getCmp('terminalsTable').reconfigure(controller.terminalsStore);
		Ext.getCmp('filterZoneCommon').bindStore(controller.zonesStore);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
	}
});