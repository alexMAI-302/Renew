Ext.define('app.controller.Dov', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'Dov.PalmSalesmans',
		'Dov.Dov'
	],
	
	models: [
		'valueModel'
	],
	
	views: [
		'Dov.Container'
	],
	
	mainContainer: null,
	
	refreshDov: function(){
		var controller=this;
		
		controller.dovStore.proxy.extraParams={
			salesman_id: Ext.getCmp('palmSalesman').getValue()
		};
		
		controller.dovStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке доверенностей");
				}
				controller.mainContainer.setLoading(false);
			}
		);
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.Dov.Container');
		
		controller.control({
			'#createDov': {
				click: function(){
					controller.mainContainer.setLoading(true);
					Ext.Ajax.request({
						url: '/dov/create_dov',
						timeout: 300000,
						params: {
							salesman_id: Ext.getCmp('palmSalesman').getValue(),
							quantity: Ext.getCmp('quantity').getValue(),
							authenticity_token: window._token
						},
						method: "POST",
						callback: function(options, success, response){
							controller.mainContainer.setLoading(false);
							if(success!==true){
								Ext.Msg.alert("Ошибка при создании доверенностей", response.responseText);
							}
							controller.refreshDov();
						}
					});
				}
			},
			'#refreshDov': {
				click: controller.refreshDov
			},
			'#deleteDov': {
				click: function(button){
					controller.mainContainer.setLoading(true);
					Ext.Ajax.request({
						url: '/dov/delete_dov',
						timeout: 300000,
						params: {
							salesman_id: Ext.getCmp('palmSalesman').getValue(),
							authenticity_token: window._token
						},
						method: "POST",
						callback: function(options, success, response){
							controller.mainContainer.setLoading(false);
							if(success!==true){
								Ext.Msg.alert("Ошибка при удалении доверенностей", response.responseText);
							}
							controller.refreshDov();
						}
					});
				}
			},
			'#palmSalesman': {
				select: function(combo, records){
					if(records!=null && records.length>0){
						var b=Ext.getCmp('printDov');
						b.href='https://rs3.unact.ru/ReportServer?/Бухгалтерия/СБС/Доверенности&salesman_id='+records[0].get('id');
						b.setParams();
						
						Ext.getCmp('operations').setDisabled(false);
						controller.refreshDov();
					} else {
						Ext.getCmp('operations').setDisabled(true);
					}
					return true;
				},
				change: function(field, newValue, oldValue, eOpts){
					Ext.getCmp('operations').setDisabled(true);
					return true;
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.dovStore=controller.getDovDovStore();
		controller.palmSalesmansStore=controller.getDovPalmSalesmansStore();
	},
	
	bindStores: function(){
		var controller=this;
		
		Ext.getCmp('DovTable').reconfigure(controller.dovStore);
		Ext.getCmp('palmSalesman').bindStore(controller.palmSalesmansStore);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
	}
});