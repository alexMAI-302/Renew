Ext.define('app.controller.TermDelivery.MakeAutoSetupTabs.Inc', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'TermDelivery.MakeAutoSetup.Periods',
		'TermDelivery.MakeAutoSetup.PpsZoneNormes',
		'TermDelivery.MakeAutoSetup.PpsZoneWorkdays',
		'TermDelivery.MakeAutoSetup.Zones',
		'TermDelivery.MakeAutoSetup.DayTypes'
	],
	
	models: [
		'valueModel',
		'TermDelivery.MakeAutoSetup.PpsZoneNormModel',
		'TermDelivery.MakeAutoSetup.PpsZoneWorkdayModel'
	],
	
	views: [
		'TermDelivery.MakeAutoSetup.Container',
		'TermDelivery.MakeAutoSetup.Inc.Container'
	],
	
	incContainer: null,
	
	ppsZoneNormesStore: null,
	periodsStore: null,
	zonesStore: null,
	ppsZoneWorkdaysStore: null,
	dayTypesStore: null,
	
	currentPeriod: null,
	
	init: function() {
		var controller = this;
		
		controller.incContainer=Ext.create('app.view.TermDelivery.MakeAutoSetup.Inc.Container');
		controller.incContainer.addListener(
			"show",
			function(){
				controller.loadDictionaries();
			}
		);
		
		Ext.getCmp('MakeAutoSetupMain').add(controller.incContainer);
		
		controller.control({
			'#filterNormes': {
				click: function(button){
					controller.ppsZoneNormesStore.proxy.extraParams={
						ddateb: Ext.getCmp('ddatebNormes').getValue(),
						ddatee: Ext.getCmp('ddateeNormes').getValue()
					};
					controller.ppsZoneNormesStore.load(
						function(records, operation, success){
							if(!success){
								Ext.Msg.alert("Ошибка", "Ошибка при обновлении норм");
							}
							return true;
						}
					);
				}
			},
			'#saveNormes': {
				click: function(){
					controller.ppsZoneNormesStore.sync({
						callback: function(batch){
							if(batch.exceptions.length>0){
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							}
							return true;
						}
					});
					return true;
				}
			},
			'#addNorm':{
				click: function(){
					var sm=Ext.getCmp('normesTable').getSelectionModel(),
						r = Ext.ModelManager.create(
							{period: controller.currentPeriod},
							'app.model.TermDelivery.MakeAutoSetup.PpsZoneNormModel');
					controller.ppsZoneNormesStore.add(r);
					sm.select(r);
				}
			},
			'#filterWorkdays': {
				click: function(button){
					controller.ppsZoneWorkdaysStore.proxy.extraParams={
						ddateb: Ext.getCmp('ddatebWorkdays').getValue(),
						ddatee: Ext.getCmp('ddateeWorkdays').getValue()
					};
					controller.ppsZoneWorkdaysStore.load(
						function(records, operation, success){
							if(!success){
								Ext.Msg.alert("Ошибка", "Ошибка при обновлении типов дней");
							}
							return true;
						}
					);
				}
			},
			'#saveWorkdays': {
				click: function(){
					controller.ppsZoneWorkdaysStore.sync({
						callback: function(batch){
							if(batch.exceptions.length>0){
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							}
							return true;
						}
					});
					return true;
				}
			},
			'#addWorkday':{
				click: function(){
					var sm=Ext.getCmp('workdaysTable').getSelectionModel(),
						r = Ext.ModelManager.create(
							{
								ddate: Ext.Date.parse(Ext.Date.format(new Date(), 'Y-m-d'), 'Y-m-d'),
								type: null
							},
							'app.model.TermDelivery.MakeAutoSetup.PpsZoneWorkdayModel');
					controller.ppsZoneWorkdaysStore.add(r);
					sm.select(r);
				}
			}
		});
	},
	
	loadDictionaries: function(){
		var controller=this;
		
		controller.periodsStore.load();
		controller.zonesStore.proxy.extraParams={
			zone_type: 5626
		};
		controller.zonesStore.load();
	},
	
	initStores: function(){
		var controller=this;
		
		controller.ppsZoneNormesStore = controller.getTermDeliveryMakeAutoSetupPpsZoneNormesStore();
		controller.periodsStore = controller.getTermDeliveryMakeAutoSetupPeriodsStore();
		controller.zonesStore = controller.getTermDeliveryMakeAutoSetupZonesStore();
		controller.ppsZoneWorkdaysStore = controller.getTermDeliveryMakeAutoSetupPpsZoneWorkdaysStore();
		controller.dayTypesStore = controller.getTermDeliveryMakeAutoSetupDayTypesStore();
		
		controller.periodsStore.addListener({
			load: function(store, records, successful, eOpts){
				if(successful!==true){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке словаря периодов");
				} else {
					var currentDateStr=Ext.Date.format(new Date(), 'Y-m');
					controller.currentPeriod=null;
					for(var i=0; i<records.length; i++){
						if(records[i].get('name')==currentDateStr){
							controller.currentPeriod=records[i].get('id');
							break;
						}
					}
				}
			}
		});
		
		controller.loadDictionaries();
	},
	
	bindStores: function(){
		var controller=this;
		
		Ext.getCmp('normesTable').reconfigure(controller.ppsZoneNormesStore);
		Ext.getCmp('workdaysTable').reconfigure(controller.ppsZoneWorkdaysStore);
	},
	
	makeComboColumn: function(column, storeCombo, tableStore, property, allowNull, onlyRenderer){
		function renderer(value){
			var matching = null;
			storeCombo.each(function(record){
				if(record.get('id')==value){
					matching=record.get('name');
				}
				return matching==null;
			});
			return matching;
		};
		
		if(!onlyRenderer){
			column.field = Ext.create('Ext.form.ComboBox', {
				store: storeCombo,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				value: "",
				autoSelect: (allowNull!==true)
			});
		}
		column.renderer=renderer;
		
		column.doSort = function(state){
			tableStore.sort({
				property: property,
				transform: renderer,
				direction: state
			});
			return true;
		};
	},
	
	initTables: function(){
		var controller=this,
			normesTable = Ext.getCmp('normesTable'),
			workdaysTable = Ext.getCmp('workdaysTable'),
			dayTypeColumn = workdaysTable.columns[1],
			periodColumn = normesTable.columns[1],
			zoneColumn = normesTable.columns[0];
		
		controller.makeComboColumn(dayTypeColumn, controller.dayTypesStore, controller.ppsZoneWorkdaysStore, 'type', true);
		controller.makeComboColumn(periodColumn, controller.periodsStore, controller.ppsZoneNormesStore, 'period');
		controller.makeComboColumn(zoneColumn, controller.zonesStore, controller.ppsZoneNormesStore, 'zone');
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
		
		controller.initTables();
	}
});