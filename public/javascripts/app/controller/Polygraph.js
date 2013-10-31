Ext.define('app.controller.Polygraph', {
    extend: 'Ext.app.Controller',
	
	views: [
		'Polygraph.Container'
	],
	
	mainContainer: null,
	
	init: function() {
		var controller = this;
		
		controller.mainContainer = Ext.create('app.view.Polygraph.Container');
		
		controller.control({
			
		});
	},
	
	onLaunch: function(){
		var controller = this;
	}
});