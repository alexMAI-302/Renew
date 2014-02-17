Ext.define('app.controller.TermDelivery.MonitorTabs.MonitorTab', {
    extend: 'Ext.app.Controller',
	stores: [
		'TermDelivery.MonitorTabs.MonitorTab.ZoneTypes',
		'TermDelivery.MonitorTabs.MonitorTab.Routes',
		'TermDelivery.MonitorTabs.MonitorTab.Terminals',
		'TermDelivery.MonitorTabs.MonitorTab.TerminalBreaks'
	],
	
	models: [
		'valueModel',
		'TermDelivery.MonitorTabs.MonitorTab.TerminalModel',
		'TermDelivery.MonitorTabs.MonitorTab.RouteModel'
	],
	
	views: [
		'TermDelivery.MonitorTabs.MonitorTab.Container'
	],
	
	zoneTypesStore: null,
	routesStore: null,
	terminalsStore: null,
	
	loadStatus: {
		zoneTypes: false,
		config: false
	},
	
	monitorContainer: null,
	userConfig: null,
	
	checkLoadStatus: function(){
		var controller=this;
		if(controller.loadStatus.zoneTypes &&
			controller.loadStatus.config){
			controller.monitorContainer.setLoading(false);
		}
	},
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.monitorContainer.setLoading(false);
	},
	
	filterRoutes: function(selectedZone){
		var controller=this,
			ddate = new Date(Ext.getCmp('ddate').getValue()),
			zoneTypeId = Ext.getCmp('zoneTypeCombo').getValue(),
			onlyWithErrors = Ext.getCmp('onlyWithErrors').getValue(),
			onlyInRoute = Ext.getCmp('onlyInRoute').getValue();
			
		controller.monitorContainer.setLoading(true);
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
			controller.monitorContainer.setLoading(false);
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
			
			controller.monitorContainer.setLoading(true);
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
				controller.monitorContainer.setLoading(false);
			});
		}
		return true;
	},
	
	makeDelivery: function(){
		var controller=this,
			terminals=[],
			sm = Ext.getCmp('routesTable').getSelectionModel(),
			selectedZone = sm.getSelection()[0];
		
		controller.monitorContainer.setLoading(true);
		
		controller.terminalsStore.each(function(r){
			if(r.dirty || r.get('should_include_in_route')){
				terminals.push({
					terminalid: r.get('id'),
					zone_id: selectedZone.get('id'),
					terminal_break_id: r.get('terminal_break_id'),
					techinfo: r.get('techinfo'),
					include_in_route: r.get('should_include_in_route')?1:0,
					serv_status: r.get('serv_status')?1:0,
					must_visit: r.get('must_visit')?1:0,
				});
			}		
			
			return true;
		});
		
		Ext.Ajax.request({
			url: '/term_delivery/monitor/save_terminal',
			params: {authenticity_token: window._token},
			jsonData: terminals,
			method: 'POST',
			timeout: 300000,
			success: function(response){
				sm.select(selectedZone);
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
			sm = Ext.getCmp('routesTable').getSelectionModel(),
			selectedZone=sm.getSelection()[0];
		
		controller.monitorContainer.setLoading(true);
		
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
			url: '/term_delivery/monitor/status4_save',
			params: {authenticity_token: window._token},
			jsonData: routes,
			method: 'POST',
			timeout: 300000,
			success: function(response){
				sm.select(selectedZone);
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
			sm = Ext.getCmp('routesTable').getSelectionModel(),
			selectedZone=sm.getSelection()[0],
			zonesToIncludeInAutoRoute=[];
		
		controller.monitorContainer.setLoading(true);
		
		controller.routesStore.each(function(r){
			if(r.get('include_in_auto_route')){
				zonesToIncludeInAutoRoute.push({id: r.get('id')});
			}
			return true;
		});
		
		Ext.Ajax.request({
			url: '/term_delivery/monitor/make_delivery_auto',
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
				sm.select(selectedZone);
				controller.filterRoutes(selectedZone);
			},
			failure: function(response){
				controller.showServerError(response);
			}
		});
	},
	
	init: function() {
		var controller = this;
		
		controller.monitorContainer = Ext.create('app.view.TermDelivery.MonitorTabs.MonitorTab.Container');
		Ext.getCmp('TermDeliveryMonitorMain').add(controller.monitorContainer);
		Ext.getCmp('TermDeliveryMonitorMain').setActiveTab(controller.monitorContainer);
		
		controller.monitorContainer.setLoading(true);
		
		controller.control({
			'#filterRoutes': {
				click: function(){
					var selectedZone=Ext.getCmp('routesTable').getSelectionModel().getSelection()[0];
					controller.filterRoutes(selectedZone);
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
		
		controller.zoneTypesStore = Ext.getCmp('zoneTypeCombo').getStore();
		controller.routesStore = Ext.getCmp('routesTable').getStore();
		controller.terminalsStore = Ext.getCmp('terminalsTable').getStore();
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
			url: '/term_delivery/monitor/get_config',
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
				if(terminal.get("in_route")){
					return false;
				} else {
					return true;					
				}
			},
			headerclick: function(headerContainer, column,e, t, eOpts){
				var zoneRecord=routesTable.getSelectionModel().getSelection()[0];
				
				controller.terminalsStore.each(function(r){
					if(
						(r.get('should_include_in_route') == !terminalsTable.checkIncludeInRoute) &&
						(!r.get('in_route'))){
						r.set('should_include_in_route', terminalsTable.checkIncludeInRoute);
					}
					return true;
				});
				terminalsTable.checkIncludeInRoute=!terminalsTable.checkIncludeInRoute;
				return true;
			}
		});
		
		//колонка поломок терминала
		terminalsTable.columns[12].setDisabled(!controller.userConfig.change_terminals);
		
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
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		controller.initLoadings();
	}
});