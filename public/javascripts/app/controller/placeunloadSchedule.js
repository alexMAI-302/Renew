Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
	'Ext.ux.grid.Printer'
]);
Ext.define('app.controller.PlaceunloadSchedule', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'placeunloadSchedule.Schedules',
		'placeunloadSchedule.Salesmans'
	],
	
	views: [
		'app.view.placeunloadSchedule.Container'
	],
	
	masterStore: null,
	salesmansStore: null,
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	loadMaster: function(){
		var controller = this;
		controller.masterStore.proxy.extraParams={
			salesman_id: Ext.getCmp('salesmansSchedulesFilter').getValue(),
			ddate: Ext.getCmp('ddateSchedulesFilter').getValue()
		};
		controller.masterStore.load();
	},
	
    init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.placeunloadSchedule.Container');
		
		controller.control({
			'#refreshSchedules': {
				click: controller.loadMaster
			},
			'#saveSchedules': {
				click: function() {
					controller.masterStore.proxy.extraParams={
						ddate: Ext.getCmp('ddateSchedulesFilter').getValue()
					};
					controller.masterStore.sync({
						callback: function(batch){
							if(batch.exceptions.length>0){
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							} else {
								controller.loadMaster();
							}
						}
					});
				}
			},
			'#printSchedules': {
				click:  function(){
					Ext.ux.grid.Printer.printAutomatically=true;
					Ext.ux.grid.Printer.closeAutomaticallyAfterPrint=true;
					Ext.ux.grid.Printer.extraCSS=['/ext/resources/css/ext-all.css'];
					Ext.ux.grid.Printer.print(Ext.getCmp('SchedulesTable'));
				}
			},
			'#salesmansSchedulesFilter': {
				select: function(field, value, options ) {
					Ext.getCmp('saveSchedules').setDisabled(value[0].id==null);
					return true;
				},
				change: function(field, newValue, oldValue, options) {
					Ext.getCmp('saveSchedules').setDisabled(newValue==null);
					return true;
				}
			}
		});
		
		function selectDayOfWeek(dayIndex, rowIndex, checked){
			var r=controller.masterStore.getAt(rowIndex);
			r.set("day_of_week", checked?dayIndex:0);
			r.set("monday", false);
			r.set("tuesday", false);
			r.set("wednesday", false);
			r.set("thursday", false);
			r.set("friday", false);
		};
		
		var columns=Ext.getCmp('SchedulesTable').columns;
		for(var i=2; i<columns.length; i++){
			columns[i].addListener(
				"checkchange",
				function(column, rowIndex, checked, eOpts){
					selectDayOfWeek(column.getIndex()-1, rowIndex, checked);
				}
			);
		}
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore = controller.getPlaceunloadScheduleSchedulesStore();
		controller.salesmansStore = controller.getPlaceunloadScheduleSalesmansStore();
	},
	
	bindStores: function(){
		var controller=this;
		
		Ext.getCmp('SchedulesTable').reconfigure(controller.masterStore);
		Ext.getCmp('salesmansSchedulesFilter').bindStore(controller.salesmansStore);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
	}
});