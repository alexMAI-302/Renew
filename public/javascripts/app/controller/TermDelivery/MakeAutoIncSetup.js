Ext.define('app.controller.TermDelivery.MakeAutoIncSetup', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'TermDelivery.MakeAutoIncSetup.Periods',
		'TermDelivery.MakeAutoIncSetup.PpsZoneNormes',
		'TermDelivery.MakeAutoIncSetup.PpsZoneWorkdays',
		'TermDelivery.MakeAutoIncSetup.Zones',
		'TermDelivery.MakeAutoIncSetup.DayTypes'
	],
	
	models: [
		'valueModel',
		'TermDelivery.MakeAutoIncSetup.PpsZoneNormModel',
		'TermDelivery.MakeAutoIncSetup.PpsZoneWorkdayModel'
	],
	
	views: [
		'TermDelivery.MakeAutoIncSetup.Container'
	],
	
	mainContainer: null,
	
	ppsZoneNormesStore: null,
	periodsStore: null,
	zonesStore: null,
	ppsZoneWorkdaysStore: null,
	
	currentPeriod: null,
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.TermDelivery.MakeAutoIncSetup.Container');
		
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
			'#addNormes':{
				click: function(){
					var sm=Ext.getCmp('NormesTable').getSelectionModel(),
						r = Ext.ModelManager.create(
							{period: controller.currentPeriod},
							'app.model.TermDelivery.MakeAutoIncSetup.PpsZoneNormModel');
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
			'#addWorkdays':{
				click: function(){
					var sm=Ext.getCmp('WorkdaysTable').getSelectionModel(),
						r = Ext.ModelManager.create(
							{
								ddate: Ext.Date.parse(Ext.Date.format(new Date(), 'Y-m-d'), 'Y-m-d'),
								type: null
							},
							'app.model.TermDelivery.MakeAutoIncSetup.PpsZoneWorkdayModel');
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
		var controller=this,
			normesTable = Ext.getCmp('NormesTable'),
			periodColumn = normesTable.columns[1],
			zoneColumn = normesTable.columns[0];
		
		controller.ppsZoneNormesStore = normesTable.getStore();
		controller.periodsStore = periodColumn.store;
		controller.zonesStore = zoneColumn.store;
		controller.ppsZoneWorkdaysStore = Ext.getCmp('WorkdaysTable').getStore();
		
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
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});