Ext.define('app.controller.JointPartner', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'JointPartner.Partner'
	],
	
	models: [
		'valueModel',
		'JointPartner.PartnerModel',
		'JointPartner.PlAllModel'
	],
	
	views: [
		'JointPartner.Container'
	],
	
	Container: null,
	partnerStore: null,
	detailStore: null,
	fields: null,
	podrStore: null,
	records: null,
	tpComboStore: null,
	plAllComboStore: null,
	plComboStore: null,
	
		
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},

	syncMaster: function(container, selectedMasterId){
		var controller=this;
		function syncDetail(container, masterId){
			if (
				(controller.detailStore.getNewRecords().length > 0) ||
				(controller.detailStore.getUpdatedRecords().length > 0) ||
				(controller.detailStore.getRemovedRecords().length > 0)){
				
				if(masterId!=null){
					controller.detailStore.proxy.extraParams={
						master_id: masterId
					};
					
					controller.detailStore.sync({
						callback: function(batch){
							if(batch.exceptions.length>0){
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							}
							container.setLoading(false);
						}
					});
				} else {
					Ext.Msg.alert("Внимание", "Ваши данные в таблице с детализацией были утеряны. Сначала сохраняйте данные в основной таблице, затем вводите детализацию.");
					container.setLoading(false);
				}
			} else {
				container.setLoading(false);
			}
		};
		
		if (
			(controller.masterStore.getNewRecords().length > 0) ||
			(controller.masterStore.getUpdatedRecords().length > 0) ||
			(controller.masterStore.getRemovedRecords().length > 0)){
				
			container.setLoading(true);
			controller.masterStore.sync({
				callback: function(batch){
					if(batch.exceptions.length>0){
						Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
						container.setLoading(false);
					} else {
						syncDetail(container, selectedMasterId);
					}
				}
			});
		} else {
			syncDetail(container, selectedMasterId);
		}
	},
	
	savePlaceunload : function (container)
	{
		var controller=this,
			routes=[];
		
		controller.Container.setLoading(true);
		
		controller.detailStore.each(function(r){
			if(r.dirty){
				for (var i = 0; i < controller.records.length; i++) 
				{
					if (r.modified['podr_tp_'+controller.records[i].id]!==undefined)
					{
						routes.push({
							what	: 'tp',
							contractant : Ext.getCmp('PartnerTable').getSelectionModel().getSelection()[0].get('id'),
							point	: r.get('id'),
							podr	: controller.records[i].id,
							value	: r.get('podr_tp_'+controller.records[i].id),
						});
					};
					if (r.modified['podr_pl_'+controller.records[i].id]!==undefined)
					{
						routes.push({
							what	: 'pl',
							contractant : Ext.getCmp('PartnerTable').getSelectionModel().getSelection()[0].get('id'),
							point	: r.get('id'),
							podr	: controller.records[i].id,
							value	: r.get('podr_pl_'+controller.records[i].id),
						});
					};
					
				}
			}
			
			return true;
		});
		
		Ext.Ajax.request({
			url: '/joint_partner/placeunload',
			params: {authenticity_token: window._token},
			jsonData: routes,
			method: 'POST',
			timeout: 300000,
			success: function(response){
				//sm.select(selectedZone);
				//controller.filterRoutes(selectedZone);
				controller.refreshPlaceunload();
				controller.Container.setLoading(false);
			},
			failure: function(response){
				controller.Container.setLoading(false);
				controller.showServerError(response);
			}
		});
	},
	
	loadDetail: function(masterId, detailTable){
		var controller=this;
		
		controller.detailStore.proxy.extraParams={
			master_id: masterId
		};
		controller.detailStore.load(
			function(){
				detailTable.setDisabled(false);
			}
		);
	},
	
	loadpodr: function(){
		var controller=this;
		Ext.Ajax.request({
			url: '/joint_partner/podr',		
			async: false,
			success: function(response){
				var response_json=Ext.JSON.decode(response.responseText, true);
				controller.records=response_json;
			return response.responseText;
		
			}
		});	
	},
	refreshPartner: function(){
		var controller = this;
		

		controller.partnerStore.proxy.extraParams={
			inn: Ext.getCmp('filterInn').getValue()
		};
		controller.Container.setLoading(true);
		controller.partnerStore.load(
			function(records, operation, success){
							controller.Container.setLoading(false);
							if(!success){
								Ext.Msg.alert("Ошибка выборки данных");
							};							
							return true;
						}
		);
		
	},
	
	refreshPlaceunload: function(){
		var controller = this,
			selected=Ext.getCmp('PartnerTable').getSelectionModel().getSelection();
		if(selected!=null && selected.length>0){
			controller.loadDetail(
				selected[0].get('id'),
				Ext.getCmp('PlaceunloadTable')
			);
		}
							
	},
	
	init: function() {
		var tbWait = Ext.create('Ext.toolbar.Toolbar', {
			renderTo: 'joint_partner_js',
			items: {
				text: 'Подождите, идёт выборка данных...'
			}
		});

		
		var controller = this,
		
		columns = [
					{
						width: 170,
						header: 'Точка',
						dataIndex: 'name'
					}
				];
		
		
		controller.fields = [{
			name: 'id',
			type: 'int'
			},
			{
			name: 'name',
			type: 'string'
		}];
		
		controller.tpComboStore=new Array();
		controller.plComboStore=new Array();
		controller.plAllComboStore = Ext.create('Ext.data.Store', {
				model: 'app.model.JointPartner.PlAllModel',
				proxy: {
					type: 'rest',
					url : '/joint_partner/podr_pl',
					reader: {
						type: 'json'
					},
					server: {timeout:60000},
					buffered : false
				}
			});
		controller.plAllComboStore.load(function(records, operation, success){
			if(success){
				controller.loadpodr();
				for (var i = 0; i < controller.records.length; i++) {

					controller.fields[i*2+2] =  {
						name: 'podr_tp_'+controller.records[i].id,
						type: 'int'	
					};
					controller.fields[i*2+3] =  {
						name: 'podr_pl_'+controller.records[i].id,
						type: 'int'	
					};
					
					columns[i+1] = {
						header: controller.records[i].name,
						columns: [
							{
								header: 'ТП',
								dataIndex: 'podr_tp_'+controller.records[i].id,
								width: 150
							},
							{
								header: 'Прайс',
								dataIndex: 'podr_pl_'+controller.records[i].id,
								width: 250
							}
						]
					};
					controller.tpComboStore[i] = Ext.create('Ext.data.Store', {
						model: 'app.model.valueModel',
						proxy: {
							type: 'rest',
							url : '/joint_partner/podr_tp',
							reader: {
								type: 'json'
							}
						}
					});
					controller.tpComboStore[i].proxy.extraParams={
						podr: controller.records[i].id
					};
					controller.tpComboStore[i].load();
					
					controller.plComboStore[i] = Ext.create('Ext.data.Store', {
						model: 'app.model.valueModel',
						proxy: {
							type: 'memory'
						}
					});
					controller.plAllComboStore.clearFilter(true);
					controller.plAllComboStore.filter("podr",controller.records[i].id);
					controller.plAllComboStore.each(
								function(record){
										controller.plComboStore[i].add({
														id: record.get('plist'),
														name: record.get('name')
													});
								}
							);
					
				};
				
				Ext.define('app.model.JointPartner.PlaceunloadModel', {
					extend: 'Ext.data.Model',
					fields: controller.fields,
				});	
				
				controller.detailStore=Ext.create('Ext.data.Store', {
					extend: 'Ext.data.Store',
					model: 'app.model.JointPartner.PlaceunloadModel',
					proxy: {
						type: 'rest',
						url : '/joint_partner/placeunload',
						reader: {
							type: 'json'
						}
					}
				});
				
				Ext.define('app.view.JointPartner.ItemsGrid', {
					extend: 'app.view.Lib.Grid.Panel',
					alias: 'widget.jointPartnerItemGrid',
					
					config: {
						suffix: 'Placeunload',
						disabled: true,
						disableSave: false,
						disableAdd: true,
						disableDelete: true,
						disableDeleteColumn: true,
						disableAddColumn: true,
						store: controller.detailStore,
						columns: columns
					}
				});

				tbWait.destroy();

				controller.Container=Ext.create('app.view.JointPartner.Container');
				controller.Container.addListener(
					"show",
					function(){
						controller.loadDictionaries();
					}
				);
				
				
				
				function getId(r){
					return (r!=null)?
							((r.getId()!=null && r.getId()!=0)?
								r.getId():
								r.get('id')
							):
							null;
				}
				
				controller.control({
					'#PartnerTable': {
						selectionchange: function(sm, selected, eOpts){
							if(selected!=null && selected.length>0){
								controller.loadDetail(
									getId(selected[0]),
									Ext.getCmp('PlaceunloadTable')
								);
							} else {
								controller.detailStore.removeAll();
								Ext.getCmp('PlaceunloadTable').setDisabled(true);
							}
							return true;
						}
					},
					'#refreshPartner': {
						click: function() {
							controller.refreshPartner();
						}

					},
					'#savePlaceunload': {
						click: function(){
							controller.savePlaceunload(controller.Container);
							return true;
						}
					},
					'#refreshPlaceunload': {
						click: function(){
							controller.refreshPlaceunload();
						}
					}
				});
				controller.initStores();
			}
		});
	},
	
	loadDictionaries: function(){
		var controller=this;
		
		controller.partnerStore.load();
		controller.detailStore.proxy.extraParams={
			master_id: -1
		};
		controller.detailStore.load();
		
		for (var i = 0; i < controller.records.length; i++) {
			col=Ext.getCmp('PlaceunloadTable').columns[i*2+1];
			controller.makeComboColumn(col,controller.tpComboStore[i], controller.detailStore, '');
			col=Ext.getCmp('PlaceunloadTable').columns[i*2+2];
			controller.makeComboColumn(col,controller.plComboStore[i], controller.detailStore, '');
		}
	},
	
	initStores: function(){
		var controller=this,
			partnerTable = Ext.getCmp('PartnerTable'),
			placeunloadTable = Ext.getCmp('PlaceunloadTable');
		
		controller.partnerStore=partnerTable.store;
		
		controller.detailStore=placeunloadTable.store;
		
		
		controller.loadDictionaries();
	},
	
	makeComboColumn: function(column, storeCombo, tableStore, property, allowNull, onlyRenderer){
		function renderer(value){
			var matching = null,
				data=storeCombo.snapshot || storeCombo.data;
			data.each(function(record){
				if(record.get('id')==value){
					matching=record.get('name');
				}
				return matching==null;
			});
			return matching;
		};
		
		if(!onlyRenderer){
			column.field = Ext.create('Ext.form.ComboBox', {
				store: storeCombo,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				value: "",
				autoSelect: (allowNull!==true)
			});
		}
		column.renderer=renderer;
		
		
	}
});