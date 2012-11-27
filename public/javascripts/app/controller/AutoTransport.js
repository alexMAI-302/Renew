Ext.define('app.controller.AutoTransport', {
    extend: 'Ext.app.Controller',
	
	views: [
		'AutoTransport.Container'
	],
	
	mainContainer: null,
	
	init: function() {
		var controller = this;
		
		controller.mainContainer = Ext.create('app.view.AutoTransport.Container');
		
		controller.control({
			
		});
	},
	
	onLaunch: function(){
		var controller = this;
	}
});