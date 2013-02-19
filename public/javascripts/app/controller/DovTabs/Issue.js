Ext.define('app.controller.DovTabs.Issue', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'Dov.PalmSalesmans',
		'Dov.Issue.Dov'
	],
	
	views: [
		'Dov.Issue.Container'
	],
	
	issueContainer: null,
	
	refreshDov: function(){
		var controller=this;
		
		controller.dovStore.proxy.extraParams={
			salesman_id: Ext.getCmp('palmSalesmanIssue').getValue()
		};
		
		controller.dovStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке доверенностей");
				}
				controller.issueContainer.setLoading(false);
			}
		);
	},
	
	dovStore: null,
	palmSalesmansStore: null,
	
	init: function() {
		var controller = this,
			mainContainer = Ext.getCmp('DovMain');
		
		controller.issueContainer=Ext.create('app.view.Dov.Issue.Container');
		
		mainContainer.add(controller.issueContainer);
		mainContainer.setActiveTab(controller.issueContainer);
		
		controller.control({
			'#createDov': {
				click: function(){
					controller.issueContainer.setLoading(true);
					Ext.Ajax.request({
						url: '/dov/create_dov',
						timeout: 300000,
						params: {
							salesman_id: Ext.getCmp('palmSalesmanIssue').getValue(),
							quantity: Ext.getCmp('quantityIssue').getValue(),
							authenticity_token: window._token
						},
						method: "POST",
						callback: function(options, success, response){
							controller.issueContainer.setLoading(false);
							if(success!==true){
								Ext.Msg.alert("Ошибка при создании доверенностей", response.responseText);
							}
							Ext.getCmp('quantityIssue').setValue(1);
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
					controller.issueContainer.setLoading(true);
					Ext.Ajax.request({
						url: '/dov/delete_dov',
						timeout: 300000,
						params: {
							salesman_id: Ext.getCmp('palmSalesmanIssue').getValue(),
							authenticity_token: window._token
						},
						method: "POST",
						callback: function(options, success, response){
							controller.issueContainer.setLoading(false);
							if(success!==true){
								Ext.Msg.alert("Ошибка при удалении доверенностей", response.responseText);
							}
							controller.refreshDov();
						}
					});
				}
			},
			'#palmSalesmanIssue': {
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
					Ext.getCmp('quantityIssue').setValue(1);
					return true;
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.dovStore=controller.getDovIssueDovStore();
		controller.palmSalesmansStore=Ext.create('app.store.Dov.PalmSalesmans');
	},
	
	bindStores: function(){
		var controller=this;
		
		Ext.getCmp('DovIssueTable').reconfigure(controller.dovStore);
		Ext.getCmp('palmSalesmanIssue').bindStore(controller.palmSalesmansStore);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
	}
});