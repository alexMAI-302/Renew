Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
    'Ext.ux.CheckColumn'
]);
Ext.define('app.controller.TermDelivery', {
    extend: 'Ext.app.Controller',
	stores: [
		'TermDelivery.ZoneTypes',
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
	branchesStore: null,
	routesStore: null,
	terminalsStore: null,
	terminalBreaksStore: null,
	
	loadStatus: {
		zoneTypes: false,
		config: false
	},
	
	mainContainer: null,
	userConfig: null,
	
	checkLoadStatus: function(){
		var controller=this;
		if(controller.loadStatus.zoneTypes &&
			controller.loadStatus.config){
			controller.mainContainer.setLoading(false);
		}
	},
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	filterRoutes: function(selectedZone){
		var controller=this,
			ddate = new Date(Ext.getCmp('ddate').getValue()),
			zoneTypeId = Ext.getCmp('zoneTypeCombo').getValue(),
			onlyWithErrors = Ext.getCmp('onlyWithErrors').getValue(),
			onlyInRoute = Ext.getCmp('onlyInRoute').getValue();
			
		controller.mainContainer.setLoading(true);
		controller.routesStore.proxy.extraParams = {
			ddate: ddate,
			zone_type_id: zoneTypeId,
			only_with_errors: onlyWithErrors,
			only_in_route: onlyInRoute
		};
		controller.routesStore.load(function(records, operation, success){
			if(success){
				Ext.getCmp('routesTable').checkIncludeInAutoRoute=true;
				if(selectedZone!=null){
					Ext.getCmp('routesTable').getSelectionModel().select(selectedZone);
				}
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
				zoneTypeId = Ext.getCmp('zoneTypeCombo').getValue(),
				onlyWithErrors = Ext.getCmp('onlyWithErrors').getValue(),
				onlyInRoute = Ext.getCmp('onlyInRoute').getValue(),
				zoneId = r.get('id');
			
			controller.mainContainer.setLoading(true);
			controller.terminalsStore.proxy.extraParams = {
				ddate: ddate,
				zone_type_id: zoneTypeId,
				only_with_errors: onlyWithErrors,
				only_in_route: onlyInRoute,
				zone_id: zoneId
			};
			controller.terminalsStore.load(function(records, operation, success){
				if(success){
					Ext.getCmp('terminalsTable').checkIncludeInRoute=true;
				} else {
					Ext.Msg.alert('Ошибка', 'Ошибка при загрузке информации о терминалах в маршруте '+r.get('name'));
				}
				controller.mainContainer.setLoading(false);
			});
		}
		return true;
	},
	
	makeDelivery: function(){
		var controller=this,
			terminals=[],
			selectedZone=Ext.getCmp('routesTable').getSelectionModel().getSelection()[0];
		
		controller.mainContainer.setLoading(true);
		
		controller.terminalsStore.each(function(r){
			if(r.dirty || r.get('should_include_in_route')){
				terminals.push({
					terminalid: r.get('id'),
					zone_id: selectedZone.get('id'),
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
			params: {authenticity_token: window._token},
			jsonData: terminals,
			method: 'POST',
			timeout: 300000,
			success: function(response){
				controller.filterRoutes(selectedZone);
			},
			failure: function(response){
				controller.showServerError(response);
			}
		});
	},
	
	saveIS: function(){
		var controller=this,
			routes=[],
			selectedZone=Ext.getCmp('routesTable').getSelectionModel().getSelection()[0];
		
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
			params: {authenticity_token: window._token},
			jsonData: routes,
			method: 'POST',
			timeout: 300000,
			success: function(response){
				controller.filterRoutes(selectedZone);
			},
			failure: function(response){
				controller.showServerError(response);
			}
		});
	},
	
	makeDeliveryAuto: function(){
		var controller=this,
			ddate = new Date(Ext.getCmp('ddate').getValue()),
			zoneTypeId = Ext.getCmp('zoneTypeCombo').getValue(),
			onlyWithErrors = Ext.getCmp('onlyWithErrors').getValue(),
			onlyInRoute = Ext.getCmp('onlyInRoute').getValue(),
			selectedZone=Ext.getCmp('routesTable').getSelectionModel().getSelection()[0]
			zonesToIncludeInAutoRoute=[];
		
		controller.mainContainer.setLoading(true);
		
		controller.routesStore.each(function(r){
			if(r.get('include_in_auto_route')){
				zonesToIncludeInAutoRoute.push({id: r.get('id')});
			}
			return true;
		})
		
		Ext.Ajax.request({
			url: '/term_delivery/make_delivery_auto',
			params: {
				ddate: ddate,
				zone_type_id: zoneTypeId,
				only_with_errors: onlyWithErrors,
				only_in_route: onlyInRoute,
				authenticity_token: window._token
			},
			jsonData: zonesToIncludeInAutoRoute,
			method: 'POST',
			timeout: 300000,
			success: function(response){
				controller.filterRoutes(selectedZone);
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
				click: function(){
					var selectedZone=Ext.getCmp('routesTable').getSelectionModel().getSelection()[0];
					controller.filterRoutes(selectedZone)
				}
			},
			'#routesTable': {
				selectionchange: controller.filterTerminals
			},
			'#refreshTerminals': {
				click: function(){
					controller.filterTerminals(null, Ext.getCmp('routesTable').getSelectionModel().getSelection());
				}
			},
			'#makeDelivery': {
				click: controller.makeDelivery
			},
			'#makeDeliveryAuto': {
				click: controller.makeDeliveryAuto
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
		var controller=this,
			terminalsTable=Ext.getCmp('terminalsTable'),
			routesTable=Ext.getCmp('routesTable');
		
		//здесь используется хардкод номеров колонок!!!!
		
		//колонка включения терминала в маршрут
		terminalsTable.columns[1].addListener({
			beforecheckchange: function(checkColumn, rowIndex, checked, eOpts){
				var terminal=terminalsTable.store.getAt(rowIndex);
				if(terminal.get("included_in_route")){
					return false;
				} else {
					var r=routesTable.getSelectionModel().getSelection()[0];
					r.set('points_inroute', r.get('points_inroute')+(checked? 1 : -1));
					return true;					
				}
			},
			checkchange: function(checkColumn, rowIndex, checked, eOpts){
				var r=routesTable.getSelectionModel().getSelection()[0];
				r.set('points_inroute', r.get('points_inroute')+(checked? 1 : -1));
				return true;
			},
			headerclick: function(headerContainer, column,e, t, eOpts){
				var zoneRecord=routesTable.getSelectionModel().getSelection()[0];
				
				controller.terminalsStore.each(function(r){
					if(
						(r.get('include_in_route') == !terminalsTable.checkIncludeInRoute) &&
						(!r.get('included_in_route'))){
						zoneRecord.set(
							'points_inroute',
							zoneRecord.get('points_inroute') +
							(terminalsTable.checkIncludeInRoute? 1 : -1));
						r.set('include_in_route', terminalsTable.checkIncludeInRoute);
					}
					return true;
				});
				terminalsTable.checkIncludeInRoute=!terminalsTable.checkIncludeInRoute;
				return true;
			}
		});
		
		//колонка поломок терминала
		terminalsTable.columns[12].setDisabled(!controller.userConfig.change_terminals);
		terminalsTable.columns[12].field = Ext.create('Ext.form.ComboBox', {
			store: controller.terminalBreaksStore,
			displayField: 'name',
			valueField: 'id'
		});
		terminalsTable.columns[12].renderer = function(value){
			var matching = controller.terminalBreaksStore.queryBy(
				function(record, id){
					return record.get('id') == value;
				});
			return (matching.items[0]) ? matching.items[0].data.name : '';
		};
		
		//колонка "комментарий ОШ"
		terminalsTable.columns[13].setDisabled(!controller.userConfig.change_techinfo);
		
		//колонка статуса обслуживания
		terminalsTable.columns[14].setDisabled(!controller.userConfig.change_terminals);
		terminalsTable.columns[14].addListener({
			beforecheckchange: function(checkColumn, rowIndex, checked, eOpts){
				return controller.userConfig.change_terminals;
			}
		});
		
		//колонка ОШ
		terminalsTable.columns[15].setDisabled(!controller.userConfig.change_techinfo);
		terminalsTable.columns[15].addListener({
			beforecheckchange: function(checkColumn, rowIndex, checked, eOpts){
				return controller.userConfig.change_techinfo;
			}
		});
		
		//колонка включения зоны в автоматическое формирование маршрутов
		routesTable.columns[0].addListener({
			headerclick: function(headerContainer, column,e, t, eOpts){
				controller.routesStore.each(function(r){
					if(r.get('include_in_auto_route') == !routesTable.checkIncludeInAutoRoute){
						r.set('include_in_auto_route', routesTable.checkIncludeInAutoRoute);
					}
					return true;
				});
				routesTable.checkIncludeInAutoRoute=!routesTable.checkIncludeInAutoRoute;
				return true;
			}
		});
		
		//колонка ИЗ
		routesTable.columns[3].setDisabled(!controller.userConfig.change_is);
		routesTable.columns[3].addListener({
			beforecheckchange: function(checkColumn, rowIndex, checked, eOpts){
				return controller.userConfig.change_is;
			}
		});
	},
	
	bindStores: function(){
		var controller=this;
		
		Ext.getCmp('zoneTypeCombo').bindStore(controller.zoneTypesStore);
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