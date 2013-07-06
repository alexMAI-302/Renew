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
		var controller = this;
		
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
			},
			'#printDov': {
				click: function(){
					var b=Ext.getCmp('printDov'),
						ndocs=[];
					controller.dovStore.each(
						function(r){
							if(r.get('to_print')==1){
								ndocs.push(r.get('ndoc'));
							}
						}	
					);
					window.open(
						'https://rs3.unact.ru/ReportServer/Pages/ReportViewer.aspx?/%D0%91%D1%83%D1%85%D0%B3%D0%B0%D0%BB%D1%82%D0%B5%D1%80%D0%B8%D1%8F/%D0%A1%D0%91%D0%A1/%D0%94%D0%BE%D0%B2%D0%B5%D1%80%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8&salesman_id='+
						Ext.getCmp('palmSalesmanIssue').getValue()+
						'&ndocs='+ndocs.join(','),
						'_blank'
					);
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.dovStore=Ext.getCmp('DovIssueTable').store;
		controller.palmSalesmansStore=Ext.getCmp('palmSalesmanIssue').store;
		
		controller.palmSalesmansStore.load();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});