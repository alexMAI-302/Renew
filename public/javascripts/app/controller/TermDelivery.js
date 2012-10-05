Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
    'Ext.ux.CheckColumn'
]);
Ext.define('app.controller.TermDelivery', {
    extend: 'Ext.app.Controller',
	stores: [
		'ZoneTypes',
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
		'TermDelivery.Panel'
	],
	
	zoneTypesStore: null,
	subdealersStore: null,
	branchesStore: null,
	routesStore: null,
	terminalsStore: null,
	
	mainContainer: null,
	
	init: function() {
		var controller = this;
		
		controller.mainContainer = Ext.create('app.view.TermDelivery.Panel');
		
		controller.control({
			
		});
		
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			controller.mainContainer.setLoading(false);
		}
		
		Ext.Ajax.timeout = 60000;
		Ext.Ajax.request.failure = showServerError;
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.zoneTypesStore = controller.getZoneTypesStore();
		controller.subdealersStore = controller.getSubdealersStore();
		controller.routesStore = controller.getTermDeliveryRoutesStore();
		controller.terminalsStore = controller.getTermDeliveryTerminalsStore();
		controller.branchesStore = controller.getBranchesStore();
		
		function sitesRenderer(value){
			var matching=null;
			controller.sitesStore.each(function(record){
				if(record.get('id')==value){
					matching=record.get('name');
				}
				return !matching;
			});
			return matching;
		};
		//ХАРДКОД НОМЕРА КОЛОНКИ!!!
		Ext.getCmp('movementDiffTable').columns[0].renderer=sitesRenderer;
		Ext.getCmp('movementDiffTable').columns[1].renderer=sitesRenderer;
		
		Ext.getCmp('siteFrom').bindStore(controller.sitesStore);
		Ext.getCmp('siteTo').bindStore(controller.sitesStore);
		Ext.getCmp('movementDiffTable').reconfigure(controller.movementDiffStore);
		Ext.getCmp('actionType').bindStore(controller.actionTypeStore);
		Ext.getCmp('siteSrcAction').bindStore(controller.sitesSrcClearStore);
		Ext.getCmp('siteDestAction').bindStore(controller.sitesDestClearStore);
		Ext.getCmp('ndocSOAction').bindStore(controller.ndocsSOClearStore);
		Ext.getCmp('ndocSupAction').bindStore(controller.ndocsSupClearStore);
	}
});