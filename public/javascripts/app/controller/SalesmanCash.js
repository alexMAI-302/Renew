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
					var ndocs = {},
						ndocs_str_array = [],
						i = 0;
					controller.masterStore.each(
						function(r){
							if(ndocs[r.get('id')]){
								ndocs[r.get('id')].cash+=r.get('cash');
							} else {
								ndocs[r.get('id')] = {
									id: r.get('id'),
									buyer_name: r.get('buyer_name'),
									cash: r.get('cash')
								}
							}
							
							return true;
						}
					);
					for(var ndoc in ndocs){
						ndocs_str_array.push(
						"ndoc["+i+"][id]="+ndocs[ndoc].id+
						"&ndoc["+i+"][buyer_name]="+ndocs[ndoc].buyer_name+
						"&ndoc["+i+"][cash]="+ndocs[ndoc].cash);
						i++;
					}
					window.open(
						'/salesman_cash/print_cash?salesman_id='+
						Ext.getCmp('salesmanCashPalmSalesmanFilter').getValue()+'&'+
						ndocs_str_array.join('&'),
						'_blank'
					);
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