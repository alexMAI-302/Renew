Ext.define('app.controller.TermDelivery.MakeAutoSetup', {
    extend: 'Ext.app.Controller',
	
	views: [
		'TermDelivery.MakeAutoSetup.Container'
	],
	
	mainContainer: null,
	
	init: function() {
		var controller = this;
		
		controller.mainContainer = Ext.create('app.view.TermDelivery.MakeAutoSetup.Container');
	},
	
	onLaunch: function(){
		var controller = this;
	}
});