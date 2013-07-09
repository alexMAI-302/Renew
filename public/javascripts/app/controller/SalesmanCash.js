Ext.define('app.controller.SalesmanCash', {
    extend: 'Ext.app.Controller',
	stores: [
		'salesmanCash.PalmSalesmans',
		'salesmanCash.SalesmanCashes'
	],
	
	models: [
		'salesmanCash.SalesmanCashModel',
		'valueModel'
	],
	
	views: [
		'salesmanCash.Container'
	],
	
	mainContainer: null,
	masterStore: null,
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	load: function(){
		var controller=this;
		
		controller.masterStore.proxy.extraParams = {
			salesman_id: Ext.getCmp('salesmanCashPalmSalesmanFilter').getValue()
		};
		
		controller.masterStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке записей");
				}
				controller.mainContainer.setLoading(false);
			}
		);
	},
	
	init: function() {
		var controller = this,
			itemsToControl={};
		
		controller.mainContainer=Ext.create('app.view.salesmanCash.Container');
		
		controller.control({
			'#saveSalesmanCash': {
				click: function(){
					controller.masterStore.proxy.extraParams={
						salesman_id: Ext.getCmp('salesmanCashPalmSalesmanFilter').getValue()
					};
					
					controller.masterStore.sync({
						callback: function(batch){
							if(batch.exceptions.length>0){
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							}
							controller.load();
						}
					});
				}
			},
			'#refreshSalesmanCash': {
				click: controller.load
			},
			'#salesmanCashPrint': {
				click: function(){
					var ndocs = {};
					controller.masterStore.each(
						function(r){
							if(r.get('cash')>0){
								if(ndocs[r.get('doc_id')]){
									ndocs[r.get('doc_id')].cash+=r.get('cash');
								} else {
									ndocs[r.get('doc_id')] = {
										id: r.get('doc_id'),
										cash: r.get('cash')
									}
								}
							}
							
							return true;
						}
					);
					Ext.Ajax.request({
						url: '/salesman_cash/print_cash',
						timeout: 600000,
						method: 'POST',
						params: {
							salesman_id: Ext.getCmp('salesmanCashPalmSalesmanFilter').getValue(),
							authenticity_token: window._token
						},
						jsonData: ndocs,
						callback: function(options, success, response){
							if(success!==true){
								controller.showServerError(response, options);
							} else {
								var win = window.open('', 'printgrid');
								
					            win.document.open();
					            win.document.write(response.responseText);
					            win.document.close();
							}
						}
					});
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore=controller.getSalesmanCashSalesmanCashesStore();
		controller.getSalesmanCashPalmSalesmansStore().load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке списка торговых представителей");
				}
				controller.mainContainer.setLoading(false);
			}
		)
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});