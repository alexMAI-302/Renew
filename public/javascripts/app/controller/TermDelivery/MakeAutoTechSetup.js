Ext.define('app.controller.TermDelivery.MakeAutoTechSetup', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'TermDelivery.MakeAutoTechSetup.Zones'
	],
	
	models: [
		'TermDelivery.MakeAutoTechSetup.ZoneModel'
	],
	
	views: [
		'TermDelivery.MakeAutoTechSetup.Container'
	],
	
	mainContainer: null,
	
	zonesStore: null,
	
	refresh: function(){
		var controller=this;
		
		controller.zonesStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке зон");
				}
				controller.mainContainer.setLoading(false);
			}
		);
		
		Ext.Ajax.request({
			url: '/term_delivery/make_auto_tech_setup/info',
			method: 'GET',
			success: function(response){
				try
				{
					var data = eval('('+response.responseText+')');
					Ext.getCmp('startTime').setValue(data.start_time);
					Ext.getCmp('stopTime').setValue(data.stop_time);
					Ext.getCmp('intervalAmt').setValue(data.interval_amt);
					Ext.getCmp('eventEnabled').setValue(data.enabled);
					
				} catch(e) {
					Ext.Msg.alert('Ошибка', 'Ошибка при загрузке настроек запуска');
				}
				controller.mainContainer.setLoading(false);
			},
			failure: function(response){
				Ext.Msg.alert("Ошибка", "Ошибка при загрузке настроек запуска");
				controller.mainContainer.setLoading(false);
			}
		});
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
		
		controller.mainContainer=Ext.create('app.view.TermDelivery.MakeAutoTechSetup.Container');
		
		controller.control({
			'#saveZones': {
				click: function(){
					var selected=Ext.getCmp('ZonesTable').getSelectionModel().getSelection()[0];
					controller.sync(
						controller.zonesStore,
						controller.mainContainer);
					return true;
				}
			},
			'#saveSettings':{
				click: function(){
					Ext.Ajax.request({
						url: '/term_delivery/make_auto_tech_setup/info',
						method: 'POST',
						params: {
							start_time: Ext.getCmp('startTime').getValue(),
							stop_time: Ext.getCmp('stopTime').getValue(),
							interval_amt: Ext.getCmp('intervalAmt').getValue(),
							event_enabled: Ext.getCmp('eventEnabled').getValue(),
							authenticity_token: window._token
						},
						failure: function(response){
							Ext.Msg.alert("Ошибка", "Ошибка при сохранении настроек запуска");
							controller.mainContainer.setLoading(false);
						}
					});
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.zonesStore=Ext.getCmp('ZonesTable').getStore();
		
		controller.refresh();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});