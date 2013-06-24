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
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	loadMaster: function(){
		var controller = this;
		controller.masterStore.proxy.extraParams={
			salesman_id: Ext.getCmp('salesmansSchedulesFilter').getValue(),
			ddate: Ext.getCmp('ddateSchedulesFilter').getValue(),
			only_without_schedule: Ext.getCmp('onlyWithoutSchedule').getValue()
		};
		controller.masterStore.load();
	},
	
    init: function() {
		var controller = this;
		
		Ext.tip.QuickTipManager.init();
		
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
			
			if(checked){
				r.set("day_of_week", r.get("day_of_week") | (1 << (dayIndex-1)));
			} else {
				r.set("day_of_week", r.get("day_of_week") & (~(1 << (dayIndex-1))));
			}
			if(!(r.get("day_of_week")>0)){
				r.set("day_of_week", (1 << (dayIndex-1)));
			}
			r.set("monday", false);
			r.set("tuesday", false);
			r.set("wednesday", false);
			r.set("thursday", false);
			r.set("friday", false);
		};
		
		var columns=Ext.getCmp('SchedulesTable').columns.slice(2, 7); //Возьмете только колонки с днями недели
		for(var i=0, len=columns.length; i<len; i++){
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
		
		controller.masterStore = Ext.getCmp('SchedulesTable').getStore();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});
