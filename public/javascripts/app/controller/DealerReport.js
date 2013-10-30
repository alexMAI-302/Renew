Ext.define('app.controller.DealerReport', {
    extend: 'Ext.app.Controller',
	
	views: [
		'DealerReport.Container'
	],
	
	Container: null,
	dealerStore: null,
	reportStore:null,
	records: null,
		
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.Container.setLoading(false);
	},

	
	saveDealer : function (container)
	{
		var controller=this,
			checked=[];
		
		controller.Container.setLoading(true);
		
		controller.dealerStore.each(function(r){
			if(r.dirty){
				for (var i = 0; i < controller.records.length; i++) 
				{
					if (r.modified['report_'+controller.records[i].id]!==undefined)
					{
						checked.push({
							dealer :  r.get('id'),
							report	: controller.records[i].id,
							checked	: (r.get('report_'+controller.records[i].id))?1:0,
						});
					};
				}
			}
			
			return true;
		});
		
		Ext.Ajax.request({
			url: '/dealer_report/dealer',
			params: {authenticity_token: window._token},
			jsonData: checked,
			method: 'POST',
			timeout: 300000,
			success: function(response){
				controller.refreshDealer();
				controller.Container.setLoading(false);
			},
			failure: function(response){
				controller.Container.setLoading(false);
				controller.showServerError(response);
			}
		});
	},
	
	loadReport: function(){
		var controller=this;
		Ext.Ajax.request({
			url: '/dealer_report/report',		
			async: false,
			success: function(response){
				var response_json=Ext.JSON.decode(response.responseText, true);
				controller.records=response_json;
			return response.responseText;
		
			}
		});	
	},
	refreshDealer: function(){
		var controller = this;
		controller.Container.setLoading(true);
		controller.dealerStore.load(
			function(records, operation, success){
							controller.Container.setLoading(false);
							if(!success){
								Ext.Msg.alert("Ошибка выборки данных");
							};							
							return true;
						}
		);
		
	},
	
	init: function() {
	
		
		var controller = this,
		column=[],
		fields=[];
		
		columns = [
					{
						dataIndex: 'id',
						hidden : true
					},
					{
					
						width: 300,
						header: 'Агент',
						dataIndex: 'name'
					}
				];
		
		
		fields = [{
			name: 'id',
			type: 'int'
			},
			{
			name: 'name',
			type: 'string'
			}
		];
		
				controller.loadReport();
				for (var i = 0; i < controller.records.length; i++) {
					fields[i+2] =  {
						name: 'report_'+controller.records[i].id,
						type: 'boolean'	
					};
					columns[i+2] = {
						header: controller.records[i].name,
						width : 50,
						dataIndex: 'report_'+controller.records[i].id,
						xtype : 'checkcolumn'
					};
				};
				
				Ext.define('app.model.DealerReport.DealerModel', {
					extend: 'Ext.data.Model',
					fields: fields,
				});	
				
				controller.dealerStore=Ext.create('Ext.data.Store', {
					extend: 'Ext.data.Store',
					model: 'app.model.DealerReport.DealerModel',
					proxy: {
						type: 'rest',
						url : '/dealer_report/dealer',
						reader: {
							type: 'json'
						}
					}
				});
				
				Ext.define('app.view.DealerReport.Grid', {
					extend: 'app.view.Lib.Grid.Panel',
					alias: 'widget.dealerReportGrid',
					
					config: {
						suffix: 'Dealer',
						disabled: true,
						disableSave: false,
						disableAdd: true,
						disableDelete: true,
						disableDeleteColumn: true,
						disableAddColumn: true,
						store: controller.dealerStore,
						afterButtons: [
							{
								xtype: 'button',
								id: 'subsmonthmid',
								text: 'Рассылка середины месяца'
							},
							{
								xtype: 'button',
								id: 'subsmonthend',
								text: 'Рассылка конца месяца'
							}
						],

						columns: columns,
						plugins: [
							{
								ptype: 'cellediting',
								clicksToEdit: 1
							}
						]
					}
				});

				controller.Container=Ext.create('app.view.DealerReport.Container');
				Ext.getCmp('DealerTable').setDisabled(false);
				controller.dealerStore.load();
				
				function getId(r){
					return (r!=null)?
							((r.getId()!=null && r.getId()!=0)?
								r.getId():
								r.get('id')
							):
							null;
				}
				
				controller.control({
					'#refreshDealer': {
						click: function() {
							controller.refreshDealer();
						}

					},
					'#saveDealer': {
						click: function(){
							controller.saveDealer(controller.Container);
							return true;
						}
					},
					'#subsmonthmid': {
						click: function(){
							Ext.Msg.confirm('Подверждение', 'Запустить рассылку отчётов на середину месяца?', function(button,text) {
								if (button === 'yes') {
									Ext.Ajax.request({
										url: '/dealer_report/button',
										timeout: 600000,
										method: 'POST',
										params: {
											button: 1,
											button_name: 'Рассылка середины месяца',
											authenticity_token: window._token
										},
										callback: function(options, success, response){
											if(success!==true){
												controller.showServerError(response, options);
											} 
										}
									});
								} 
							});
						}
					},
					'#subsmonthend': {
						click: function(){
							Ext.Msg.confirm('Подверждение', 'Запустить рассылку отчётов на конец месяца?', function(button,text) {
								if (button === 'yes') {
									Ext.Ajax.request({
										url: '/dealer_report/button',
										timeout: 600000,
										method: 'POST',
										params: {
											button: 2,
											button_name: 'Рассылка конца месяца',
											authenticity_token: window._token
										},
										callback: function(options, success, response){
											if(success!==true){
												controller.showServerError(response, options);
											} 
										}
									});
								} 
							});
						}
					}
				});
					
	}
});