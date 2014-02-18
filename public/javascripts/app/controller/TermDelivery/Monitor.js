Ext.define('app.controller.TermDelivery.Monitor', {
    extend: 'Ext.app.Controller',
	
	views: [
		'TermDelivery.MonitorTabs.Container'
	],
	
	mainContainer: null,
	
	init: function() {
		var controller = this;
		
		controller.mainContainer = Ext.create('app.view.TermDelivery.MonitorTabs.Container');
		
		controller.control({
			
		});
	},
	
	onLaunch: function(){
		var controller = this;
	}
});