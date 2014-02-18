Ext.define('app.controller.TermDelivery.MonitorTabs.TechRequest', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'TermDelivery.MonitorTabs.TechRequest.TechRequestData',
		'TermDelivery.MonitorTabs.TechRequest.Zones'
	],
	
	views: [
		'TermDelivery.MonitorTabs.TechRequest.Container'
	],
	
	mainContainer: null,
	masterStore: null,
	
	refreshTechRequest: function(){
		var controller=this;
		
		controller.masterStore.proxy.extraParams={
			param_zoneid: Ext.getCmp('techrequestZone').getValue(),
			param_ddate: Ext.getCmp('techrequestDdate').getValue()
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
		
		controller.techrequestContainer=Ext.create('app.view.TermDelivery.MonitorTabs.TechRequest.Container');
		Ext.getCmp('TermDeliveryMonitorMain').add(controller.techrequestContainer);
				
		controller.control({
			'#refreshTechRequest': {
				click: controller.refreshTechRequest
			}, //#filterCreateRequest
			
			'#saveTechRequest': {
				click: function(){								
					controller.masterStore.sync();
					
					return true;
				}
			}
		});	//controller.control
			
	},
	
	loadDictionaries: function(){
		var controller=this;
		
		controller.zonesStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке справочника фильтра");
				};
			}
		);
				
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore=Ext.getCmp('TechRequestTable').getStore();
		controller.zonesStore =Ext.getCmp('techrequestZone').getStore();
		
		controller.loadDictionaries();
		controller.refreshTechRequest();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});