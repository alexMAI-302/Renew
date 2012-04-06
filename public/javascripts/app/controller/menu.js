Ext.define('app.controller.menu', {
    extend: 'Ext.app.Controller',
    init: function() {
	
		function showServerError(response, options) {
			console.log("!!!");
			Ext.Msg.show({
				title: 'Ошибка',
				msg: response.responseText,
				modal: true,
				autoScroll: true,
				buttons: Ext.Msg.OK
			});
		};
		
		Ext.Ajax.request.failure = showServerError;
		
		Ext.Ajax.request({
			url: '/util_data/get_menu',
			success: function(response){
				var items=Ext.JSON.decode(response.responseText, true);
				
				var tb = Ext.create('Ext.toolbar.Toolbar', {
					renderTo: Ext.get('menu_js'),
					items: items
				});
			}
		});
	}
});