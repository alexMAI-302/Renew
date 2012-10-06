Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
    'Ext.ux.CheckColumn'
]);
Ext.define('app.controller.TermDelivery', {
    extend: 'Ext.app.Controller',
	stores: [
		'TermDelivery.ZoneTypes',
		'Subdealers',
		'Branches',
		'TermDelivery.Routes',
		'TermDelivery.Terminals'
	],
	
	models: [
		'valueModel',
		'TermDelivery.TerminalModel',
		'TermDelivery.RouteModel'
	],
	
	views: [
		'TermDelivery.Container'
	],
	
	zoneTypesStore: null,
	subdealersStore: null,
	branchesStore: null,
	routesStore: null,
	terminalsStore: null,
	
	loadStatus: {
		subdealersStore: false,
		zoneTypes: false,
		config: false,
	},
	
	mainContainer: null,
	
	checkLoadStatus: function(){
		var controller=this;
		if(loadStatus.subdealersStore && loadStatus.zoneTypes && loadStatus.config){
			controller.mainContainer.setLoading(false);
		}
	}
	
	filterRoutes: function(button, e, eOpts){
		var controller=this,
			ddate = new Date(Ext.getCmp('ddate').getValue()),
			subdealerId = Ext.getCmp('subdealerCombo').getValue(),
			zoneTypeId = Ext.getCmp('zoneTypeCombo').getValue(),
			onlyWithErrors = Ext.getCmp('onlyWithErrors').getValue(),
			onlyInRoute = Ext.getCmp('onlyInRoute').getValue();
		
		Ext.getCmp('mainContainer').setLoading(true);
		
		controller.routesStore.proxy.extraParams={
			ddate: ddate,
			subdealer_id: subdealerId,
			zone_type_id: zoneTypeId,
			only_with_errors: onlyWithErrors,
			only_in_route: onlyInRoute
		};
		
		controller.routesStore.load(
			function(records, operation, success){
				if(success){
					
				} else {
					Ext.Msg.alert('Ошибка', "Ошибка при получении маршрутов");
				}
				Ext.getCmp('mainContainer').setLoading(false);				
			});
	},
	
	getTerminals: function(zoneRecord){
		var controller=this,
			ddate = new Date(Ext.getCmp('ddate').getValue()),
			subdealerId = Ext.getCmp('subdealerCombo').getValue(),
			zoneTypeId = Ext.getCmp('zoneTypeCombo').getValue(),
			onlyWithErrors = Ext.getCmp('onlyWithErrors').getValue(),
			onlyInRoute = Ext.getCmp('onlyInRoute').getValue();
		
		Ext.getCmp('mainContainer').setLoading(true);
		
		controller.terminalsStore.proxy.extraParams={
			ddate: ddate,
			subdealer_id: subdealerId,
			zone_type_id: zoneTypeId,
			only_with_errors: onlyWithErrors,
			only_in_route: onlyInRoute,
			zone_id: zoneRecord.get('id')
		};
		
		controller.terminalsStore.load(
			function(records, operation, success){
				if(success){
					
				} else {
					Ext.Msg.alert('Ошибка', "Ошибка при получении терминалов в маршруте "+zoneRecord.get('name'));
				}
				Ext.getCmp('mainContainer').setLoading(false);				
			});
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer = Ext.create('app.view.TermDelivery.Container');
		controller.mainContainer.setLoading(true);
		
		controller.control({
			'#filterRoutes': {
				click: controller.filterRoutes
			},
			'#routesTable': {
				selectionchange: function(sm, selected, eOpts){
					var r=selected[0];
					
					if(r!=null){
						controller.getTerminals(r);
					}
					
					return true;
				}
			}
		});
		
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			controller.mainContainer.setLoading(false);
		};
		
		Ext.Ajax.timeout = 60000;
		Ext.Ajax.request.failure = showServerError;
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.zoneTypesStore = controller.getTermDeliveryZoneTypesStore();
		controller.subdealersStore = controller.getSubdealersStore();
		controller.routesStore = controller.getTermDeliveryRoutesStore();
		controller.terminalsStore = controller.getTermDeliveryTerminalsStore();
		controller.branchesStore = controller.getBranchesStore();
		
		controller.zoneTypesStore.addListener({
			'load': function(){
				controller.loadStatus.zoneTypes = true;
				controller.checkLoadStatus();
			}
		});
		
		controller.subdealersStore.addListener({
			'load': function(){
				controller.loadStatus.subdealersStore = true;
				controller.checkLoadStatus();
			}
		});
		
		Ext.Ajax.request({
			url: '/term_delivery/get_config',
			method: 'GET',
			success: function(options, success, response){
				if(success){
					var config=Ext.JSON.decode(response.responseText, true);
					Ext.getCmp('saveIS').setEnabled(config.show_save_is);
					Ext.getCmp('makeDelivery').setEnabled(config.show_make_delivery);
				} else {
					Ext.Msg.alert('Ошибка', "Ошибка при получении конфигурации: "+response.responseText);
				}
				controller.loadStatus.config=true;
				controller.checkLoadStatus();
			}
		});
		
		Ext.getCmp('zoneTypeCombo').bindStore(controller.zoneTypesStore);
		Ext.getCmp('subdealerCombo').bindStore(controller.subdealersStore);
		Ext.getCmp('routesTable').reconfigure(controller.routesStore);
		Ext.getCmp('terminalsTable').bindStore(controller.terminalsStore);
	}
});