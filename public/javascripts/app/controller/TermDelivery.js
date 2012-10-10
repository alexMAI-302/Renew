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
		'TermDelivery.Terminals',
		'TermDelivery.TerminalBreaks'
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
	terminalBreaksStore: null,
	
	loadStatus: {
		subdealersStore: false,
		zoneTypes: false,
		config: false
	},
	
	mainContainer: null,
	userConfig: null,
	
	checkLoadStatus: function(){
		var controller=this;
		if(controller.loadStatus.subdealersStore &&
			controller.loadStatus.zoneTypes &&
			controller.loadStatus.config){
			controller.mainContainer.setLoading(false);
		}
	},
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	filterRoutes: function(button, e, eOpts){
		var controller=this,
			ddate = new Date(Ext.getCmp('ddate').getValue()),
			subdealerId = Ext.getCmp('subdealerCombo').getValue(),
			zoneTypeId = Ext.getCmp('zoneTypeCombo').getValue(),
			onlyWithErrors = Ext.getCmp('onlyWithErrors').getValue(),
			onlyInRoute = Ext.getCmp('onlyInRoute').getValue();
			
		controller.mainContainer.setLoading(true);
		controller.routesStore.proxy.extraParams = {
			ddate: ddate,
			subdealer_id: subdealerId,
			zone_type_id: zoneTypeId,
			only_with_errors: onlyWithErrors,
			only_in_route: onlyInRoute
		};
		controller.routesStore.load(function(records, operation, success){
			if(success){
			} else {
				Ext.Msg.alert('Ошибка', 'Ошибка при загрузке информации о маршрутах.');
			}
			controller.terminalsStore.removeAll();
			controller.mainContainer.setLoading(false);
		});
	},
	
	filterTerminals: function(sm, selected, eOpts){
		var r=selected[0];
		
		if(r!=null){
			var controller=this,
				ddate = new Date(Ext.getCmp('ddate').getValue()),
				subdealerId = Ext.getCmp('subdealerCombo').getValue(),
				zoneTypeId = Ext.getCmp('zoneTypeCombo').getValue(),
				onlyWithErrors = Ext.getCmp('onlyWithErrors').getValue(),
				onlyInRoute = Ext.getCmp('onlyInRoute').getValue(),
				zoneId = r.get('id');
			
			controller.mainContainer.setLoading(true);
			controller.terminalsStore.proxy.extraParams = {
				ddate: ddate,
				subdealer_id: subdealerId,
				zone_type_id: zoneTypeId,
				only_with_errors: onlyWithErrors,
				only_in_route: onlyInRoute,
				zone_id: zoneId
			};
			controller.terminalsStore.load(function(records, operation, success){
				if(success){
				} else {
					Ext.Msg.alert('Ошибка', 'Ошибка при загрузке информации о терминалах в маршруте '+r.get('name'));
				}
				controller.mainContainer.setLoading(false);
			});
		}
		return true;
	},
	
	makeDelivery: function(){
		var controller=this, terminals=[];
		
		controller.mainContainer.setLoading(true);
		
		controller.terminalsStore.each(function(r){
			if(r.dirty){
				terminals.push({
					terminalid: r.get('terminalid'),
					zone_id: r.get('zone_id'),
					terminal_break_id: r.get('terminal_break_id'),
					techinfo: r.get('techinfo'),
					include_in_route: r.get('include_in_route')?1:0,
					serv_status: r.get('serv_status')?1:0
				});
			}		
			
			return true;
		});
		
		Ext.Ajax.request({
			url: '/term_delivery/save_terminal',
			params: {},
			jsonData: terminals,
			method: 'POST',
			timeout: 300000,
			success: function(response){
				controller.filterRoutes();
			},
			failure: function(response){
				controller.showServerError(response);
			}
		});
	},
	
	saveIS: function(){
		var controller=this, routes=[];
		
		controller.mainContainer.setLoading(true);
		
		controller.routesStore.each(function(r){
			if(r.dirty){
				routes.push({
					id					: r.get('id'),
					delivery_status4	: r.get('delivery_status4')?1:0
				});
			}
			
			return true;
		});
		
		Ext.Ajax.request({
			url: '/term_delivery/status4_save',
			params: {},
			jsonData: routes,
			method: 'POST',
			timeout: 300000,
			success: function(response){
				controller.filterRoutes();
			},
			failure: function(response){
				controller.showServerError(response);
			}
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
				selectionchange: controller.filterTerminals
			},
			'#makeDelivery': {
				click: controller.makeDelivery
			},
			'#saveIS': {
				click: controller.saveIS
			}
		});
		
		Ext.Ajax.timeout = 60000;
		Ext.Ajax.request.failure = controller.showServerError;
	},
	
	initStores: function(){
		var controller=this;
		
		controller.zoneTypesStore = controller.getTermDeliveryZoneTypesStore();
		controller.subdealersStore = controller.getSubdealersStore();
		controller.routesStore = controller.getTermDeliveryRoutesStore();
		controller.terminalsStore = controller.getTermDeliveryTerminalsStore();
		controller.branchesStore = controller.getBranchesStore();
		controller.terminalBreaksStore = controller.getTermDeliveryTerminalBreaksStore();
	},
	
	initLoadings: function(){
		var controller=this;
		
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
			callback: function(options, success, response){
				if(success){
					controller.userConfig=Ext.JSON.decode(response.responseText, true);
					Ext.getCmp('saveIS').setVisible(controller.userConfig.change_is);
					Ext.getCmp('makeDelivery').setVisible(controller.userConfig.change_terminals);
					
					controller.initTables();
				} else {
					Ext.Msg.alert('Ошибка', "Ошибка при получении конфигурации: "+response.responseText);
				}
				controller.loadStatus.config=true;
				controller.checkLoadStatus();
			}
		});
	},
	
	initTables: function(){
		var controller=this;
		
		//здесь используется хардкод номеров колонок!!!!
		
		//колонка включения терминала в маршрут
		Ext.getCmp('terminalsTable').columns[1].addListener({
			checkchange: function(checkColumn, rowIndex, checked, eOpts){
				var r=Ext.getCmp('routesTable').getSelectionModel().getSelection()[0];
				r.set('points_inroute', r.get('points_inroute')+(checked? 1 : -1));
				return true;
			}
		});
		
		//колонка поломок терминала
		Ext.getCmp('terminalsTable').columns[13].setDisabled(!controller.userConfig.change_terminals);
		Ext.getCmp('terminalsTable').columns[13].field = Ext.create('Ext.form.ComboBox', {
			store: controller.terminalBreaksStore,
			displayField: 'name',
			valueField: 'id'
		});
		Ext.getCmp('terminalsTable').columns[13].renderer = function(value){
			var matching = controller.terminalBreaksStore.queryBy(
				function(record, id){
					return record.get('id') == value;
				});
			return (matching.items[0]) ? matching.items[0].data.name : '';
		};
		
		//колонка "комментарий ОШ"
		Ext.getCmp('terminalsTable').columns[15].setDisabled(!controller.userConfig.change_techinfo);
		
		//колонка статуса обслуживания
		Ext.getCmp('terminalsTable').columns[16].setDisabled(!controller.userConfig.change_terminals);
		Ext.getCmp('terminalsTable').columns[16].addListener({
			beforecheckchange: function(checkColumn, rowIndex, checked, eOpts){
				return controller.userConfig.change_terminals;
			}
		});
		
		//колонка ОШ
		Ext.getCmp('terminalsTable').columns[17].setDisabled(!controller.userConfig.change_techinfo);
		Ext.getCmp('terminalsTable').columns[17].addListener({
			beforecheckchange: function(checkColumn, rowIndex, checked, eOpts){
				return controller.userConfig.change_techinfo;
			}
		});
		
		//колонка ИЗ
		Ext.getCmp('routesTable').columns[2].setDisabled(!controller.userConfig.change_is);
		Ext.getCmp('routesTable').columns[2].addListener({
			beforecheckchange: function(checkColumn, rowIndex, checked, eOpts){
				return controller.userConfig.change_is;
			}
		});
	},
	
	bindStores: function(){
		var controller=this;
		
		Ext.getCmp('zoneTypeCombo').bindStore(controller.zoneTypesStore);
		Ext.getCmp('subdealerCombo').bindStore(controller.subdealersStore);
		Ext.getCmp('routesTable').reconfigure(controller.routesStore);
		Ext.getCmp('terminalsTable').bindStore(controller.terminalsStore);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.initLoadings();
		
		controller.bindStores();
	}
});