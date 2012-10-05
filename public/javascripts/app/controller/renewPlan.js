Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
    'Ext.ux.CheckColumn'
]);
Ext.define('app.controller.renewPlan', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.renewPlan.renewPlanModel',
		'app.model.renewPlan.siteStorageModel',
		'app.model.valueModel'
	],
    init: function() {
	
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		}
	
		function loadRenewPlans(){
			var ddateb = new Date(filterPanel.down('#startDate').getValue());
			var ddatee = new Date(filterPanel.down('#endDate').getValue());
			
			siteStoragesStore.proxy.extraParams={};
			
			siteStoragesStore.load(function(records, operation, success){
				renewPlansStore.proxy.extraParams={
					ddateb: Ext.Date.format(ddateb, 'Y-m-d'),
					ddatee: Ext.Date.format(ddatee, 'Y-m-d')
				};
				renewPlansStore.load();
			});
			
			refreshDdate();
		}
	
		var siteStoragesStore = Ext.create('Ext.data.Store', {
			model: 'app.model.renewPlan.siteStorageModel',
			proxy: {
				type: 'rest',
				url : '/renew_plan/get_site_to_storages',
				reader: {
					type: 'json'
				}
			}
		});
		
		var storagesStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			
			proxy: {
		        type: 'memory'
			}
		});
		
		var renewPlansStore = Ext.create('Ext.data.Store', {
			model: 'app.model.renewPlan.renewPlanModel',
			sorters: [
				{
					property : 'send_ddate',
					direction: 'ASC'
				},
				{
					property : 'site_from',
					direction: 'ASC'
				}
			],
			proxy: {
				type: 'rest',
				url : '/renew_plan/get_renew_plans',
				reader: {
					type: 'json'
				}
			},
			listeners: {
				"load": function(store, records, successful, operation, options ){
					if(successful){
						renewPlansPanel.setLoading(false);
					}
				}
			}
		});
	
		var mainContainer=Ext.create('Ext.container.Container', {
			width: 1000,
			layout: {
				type: 'anchor'
			},
			renderTo: Ext.get('renew_plan_js'),
			defaults: {
				style: {
					margin: '10px'
				}
			}
		});
		
		var filterPanel=Ext.create('Ext.form.Panel',{
			layout: {
				type: 'hbox'
			},
			defaults: {
				style: {
					margin: '5px'
				}
			},
			items: [{
				id: 'startDate',
				xtype: 'datefield',
				name: 'startDate',
				fieldLabel: 'Начало периода',
				format: 'd.m.Y',
				altFormat: 'd/m/Y|d m Y',
				startDay: 1,
				value: Ext.Date.add(new Date(Ext.Date.now()), Ext.Date.DAY, 1)
			},{
				id: 'endDate',
				xtype: 'datefield',
				name: 'endDate',
				fieldLabel: 'Конец периода',
				format: 'd.m.Y',
				altFormat: 'd/m/Y|d m Y',
				startDay: 1,
				value: Ext.Date.add(new Date(Ext.Date.now()), Ext.Date.DAY, 3)
			}]
		});
		
		var filterRenewPlans=Ext.create('Ext.Button', {
			text    : 'Фильтр',
			handler : loadRenewPlans
		});
		
		filterPanel.add(filterRenewPlans);
		mainContainer.add(filterPanel);
		
		var cellEditingRenewPlans = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1,
			listeners: {
				beforeedit: function(editor, e, options){
					if(e.record.get("sorder")){
						if(e.colIdx==9){
							return false;
						}
					}
					return true;
				}
			}
		});
		
		var gridId='renewPlansTable';
		var renewPlansPanel=Ext.create('Ext.grid.Panel', {
			id: gridId,
			title: 'Межплощадочные перемещения',
			store: renewPlansStore,
			columns: [
				Ext.create('Ext.grid.RowNumberer'),
				{
					width: 100,
					header: 'Дата',
					dataIndex: 'send_ddate',
					renderer: Ext.util.Format.dateRenderer('d.m.Y'),
					disabled: true
				},
				{
					width: 100,
					header: 'Откуда',
					dataIndex: 'site_from',
					disabled: true
				},
				{
					width: 100,
					header: 'Куда',
					dataIndex: 'site_to',
					disabled: true
				},
				{
					xtype:'actioncolumn',
					width:75,
					header: 'План',
					items: [{
						getClass: function(v, meta, rec) {
							return (rec.get('plan'))?'checked-col':'unchecked-col';
						},
						handler: function(grid, rowIndex, colIndex) {
							var rec=grid.store.getAt(rowIndex);
							if(!rec.get("sorder")){
								mainContainer.setLoading(true);
								Ext.Ajax.request({
									url: '/renew_plan/do_plan',
									timeout: 1200000,
									params: {
										id: rec.get("id"),
										site_to_storage: rec.get("site_to_storage"),
										authenticity_token: window._token
									},
									success: function(response){
										mainContainer.setLoading(false);
										loadRenewPlans();
									},
									failure: showServerError
								});
							}
						}
					}]
				},
				{
					xtype:'actioncolumn',
					width:75,
					header: 'Поставка',
					items: [{
						getClass: function(v, meta, rec) {
							return (rec.get('sorder'))?'checked-col':'unchecked-col';
						},
						handler: function(grid, rowIndex, colIndex) {
							var rec=grid.store.getAt(rowIndex);
							mainContainer.setLoading(true);
							Ext.Ajax.request({
								url: '/renew_plan/do_sorder',
								timeout: 600000,
								params: {
									id: rec.get("id"),
									site_to_storage: rec.get("site_to_storage"),
									authenticity_token: window._token
								},
								success: function(response){
									if(response.responseText=="lackvol"){
										Ext.Msg.alert("Внимание", "Заказ сформирован с отклонениями от плана!");
									}
									mainContainer.setLoading(false);
									loadRenewPlans();
								},
								failure: showServerError
							});
						}
					}]
				},
				{
					width: 100,
					header: 'Номер заказа',
					dataIndex: 'sndoc',
					disabled: true
				},
				{
					width: 100,
					header: 'Вес',
					dataIndex: 'weight',
					disabled: true,
					renderer: function(value, metaData, record){
						return (record.get('sndoc') && record.get('sndoc')!="") ? value : '';
					}
				},
				{
					width: 100,
					header: 'Объем',
					dataIndex: 'volume',
					disabled: true,
					renderer: function(value, metaData, record){
						return (record.get('sndoc') && record.get('sndoc')!="") ? value : '';
					}
				},
				{
					xtype:'actioncolumn',
					width:20,
					header: 'Н',
					items: [{
						getClass: function(v, meta, rec) {
							if(rec.get('sorder_status')=="x"){
								return '';
							} else if(rec.get('sorder_status')=="1"){
								return 'checked-col';
							} else if(rec.get('sorder_status')=="0"){
								return 'unchecked-col';
							}
						},
						handler: function(grid, rowIndex, colIndex) {
							var rec=grid.store.getAt(rowIndex);
							if(rec.get("sorder")){
								mainContainer.setLoading(true);
								Ext.Ajax.request({
									url: '/renew_plan/do_sorder_status1',
									timeout: 600000,
									params: {
										id: rec.get("id"),
										site_to_storage: rec.get("site_to_storage"),
										authenticity_token: window._token
									},
									success: function(response){
										mainContainer.setLoading(false);
										loadRenewPlans();
									},
									failure: showServerError
								});
							}
						}
					}]
				},
				{
					header: 'Id',
					dataIndex: 'id',
					disabled: true
				},
				{
					width: 170,
					header: 'Склад площадки-приемника',
					dataIndex: 'site_to_storage',
					renderer: function(value){
						var matching = siteStoragesStore.queryBy(
							function(record, id){
								return record.get('id') == value;
							});
						return (matching.items[0]) ? matching.items[0].data.storage_name : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: storagesStore,
						displayField: 'name',
						valueField: 'id',
						allowBlank: false,
						listeners:{
							"focus": function (obj, options){
								obj.expand();
							}
						}
					}) 
				}
			],
			rowToDelete: null,
			selModel : Ext.create('Ext.selection.CellModel', {
				selType: 'cellmodel',
				listeners : {
					select : function(cellModel, record, rowIndex) {
						var newStorages=[];
						var i=0;
						
						if(record){
							siteStoragesStore.each( function(record_site){
								if(
									record_site.get("site_to") == record.get("site_to_id") &&
									record_site.get("site_from") == record.get("site_from_id")){
									
									newStorages[i]=Ext.ModelManager.create({
										id: record_site.get("id"),
										name: record_site.get("storage_name")
									}, 'app.model.valueModel');
									i++;
								}
								return true;
							});
						}
						renewPlansPanel.columns[11].field.store.loadData(newStorages, false);
					},
					scope : this
				}
			}),
			plugins: [cellEditingRenewPlans],
			height: 400
		});
		
		var refreshContainer=Ext.create('Ext.container.Container', {
			layout: {
				type: 'hbox'
			},
			margins: '10 0 0 10'
		});
		
		var refreshDdateLabel=Ext.create("Ext.form.Label", {});
		function refreshDdate(){
		
			Ext.Ajax.request({
				url: '/renew_plan/get_refreshddate',
				success: function(response){
					var response_json=Ext.JSON.decode(response.responseText, true);
					
					refreshDdateLabel.setText("Остатки обновлены "+response_json.refresh_ddate);
				},
				failure: showServerError
			});
		}
		
		var refreshRemains=Ext.create('Ext.Button', {
			text    : 'Обновить остатки',
			scale	: 'small',
			margins : '20 0 0 0',
			handler : function() {
				mainContainer.setLoading(true);
				Ext.Ajax.request({
					url: '/renew_plan/do_renew_eremsite',
					timeout: 600000,
					success: function(response){
						refreshDdate();
						mainContainer.setLoading(false);
					},
					failure: showServerError
				});
			}
		});
		
		refreshContainer.add(refreshDdateLabel);
		refreshContainer.add(refreshRemains);
		
		mainContainer.add(renewPlansPanel);
		mainContainer.add(refreshContainer);
		
		refreshDdate();
		loadRenewPlans();
	}
});