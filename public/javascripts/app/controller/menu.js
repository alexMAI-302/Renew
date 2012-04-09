Ext.define('app.controller.menu', {
    extend: 'Ext.app.Controller',
    init: function() {
	
		function showServerError(response, options) {
			Ext.Msg.show({
				title: 'Ошибка',
				msg: response.responseText,
				modal: true,
				autoScroll: true,
				buttons: Ext.Msg.OK
			});
		};
		
		var tbWait = Ext.create('Ext.toolbar.Toolbar', {
			renderTo: Ext.get('menu_js'),
			items: {
				text: 'Идет загрузка меню'
			}
		});
		
		Ext.Ajax.request({
			url: '/util_data/get_menu',
			success: function(response){
				var items=Ext.JSON.decode(response.responseText, true);
				
				tbWait.destroy();
				
				var tb = Ext.create('Ext.toolbar.Toolbar', {
					renderTo: Ext.get('menu_js'),
					items: items
				});
			},
			failure: showServerError
		});
	}
});