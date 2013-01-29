Ext.define('app.controller.Dov', {
    extend: 'Ext.app.Controller',
	
	views: [
		'Dov.Container'
	],
	
	mainContainer: null,
	
	init: function() {
		var controller = this;
		
		controller.mainContainer = Ext.create('app.view.Dov.Container');
		
		controller.control({
			
		});
	},
	
	onLaunch: function(){
		var controller = this;
	}
});