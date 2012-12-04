Ext.define('app.controller.AutoTransportTabs.Nomenclature', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'AutoTransport.Nomenclature.Nomenclature',
		'AutoTransport.Nomenclature.NomenclatureGroup',
		'AutoTransport.Nomenclature.NomenclatureGroupType',
		'AutoTransport.Measure'
	],
	
	models: [
		'valueModel',
		'AutoTransport.NomenclatureModel',
		'AutoTransport.NomenclatureGroupModel'
	],
	
	views: [
		'AutoTransport.Container',
		'AutoTransport.Nomenclature.Container'
	],
	
	nomenclatureContainer: null,
	
	nomenclatureStore: null,
	nomenclatureGroupStore: null,
	nomenclatureGroupTypeStore: null,
	measureStore: null,
	
	refreshNomenclatureGroup: function(){
		var controller=this;
		
		controller.nomenclatureGroupTypeStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке типов групп номенклатуры");
				} else {
					controller.nomenclatureGroupStore.load(
						function(records1, operation1, success1){
							if(!success1){
								Ext.Msg.alert("Ошибка", "Ошибка при загрузке групп номенклатуры");
							} else {
								var r=Ext.getCmp('nomenclatureGroupsTable').getSelectionModel().getSelection()[0];
								if(r!=null) {
									controller.nomenclatureStore.extraParams={
										group_id: r.get('id')
									};
									controller.nomenclatureStore.load(
										function(records2, operation2, success2){
											if(!success2){
												Ext.Msg.alert("Ошибка", "Ошибка при загрузке номенклатуры");
											} else {
												controller.nomenclatureContainer.setLoading(false);
											}
										}
									);
								}
							}
						}
					);
				}
			}
		);
	},
	
	syncMaster: function(masterStore, detailStore, container, selectedMasterId){
		function syncDetail(detailStore, container){
			if (
				(detailStore.getNewRecords().length > 0) ||
				(detailStore.getUpdatedRecords().length > 0) ||
				(detailStore.getRemovedRecords().length > 0)){
				
				if(selectedMasterId!=null){
					detailStore.exrtaParams = {
						at_ggroup: selectedMasterId
					};
					
					detailStore.sync({
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
			(masterStore.getNewRecords().length > 0) ||
			(masterStore.getUpdatedRecords().length > 0) ||
			(masterStore.getRemovedRecords().length > 0)){
				
			container.setLoading(true);
			masterStore.sync({
				callback: function(batch){
					if(batch.exceptions.length>0){
						Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
						container.setLoading(false);
					} else {
						syncDetail(detailStore, container);
					}
				}
			});
		} else {
			syncDetail(detailStore, container);
		}
	},
	
	init: function() {
		var controller = this;
		
		controller.nomenclatureContainer=Ext.create('app.view.AutoTransport.Nomenclature.Container');
		
		Ext.getCmp('AutoTransportMain').add(controller.nomenclatureContainer);
		
		controller.control({
			'#nomenclatureGroupsTable': {
				selectionchange: function(sm, selected, eOpts){
					if(selected!=null && selected.length>0){
						controller.nomenclatureStore.proxy.extraParams={
							group_id: selected[0].get('id')
						};
						controller.nomenclatureStore.load();
						Ext.getCmp('deleteNomenclatureGroup').setDisabled(false);
						Ext.getCmp('nomenclatureTable').setDisabled(false);
					} else {
						Ext.getCmp('deleteNomenclatureGroup').setDisabled(true);
						Ext.getCmp('nomenclatureTable').setDisabled(true);
					}
					return true;
				}
			},
			'#nomenclatureTable': {
				selectionchange: function(sm, selected, eOpts){
					Ext.getCmp('deleteNomenclature').setDisabled(selected==null || selected.length==0);
					return true;
				}
			},
			'#addNomenclature':{
				click: function(){
					var sm=Ext.getCmp('nomenclatureGroupsTable').getSelectionModel(),
						selected=sm.getSelection()[0],
						at_ggroup=(selected!=null)?selected.get('id'):null,
						r = Ext.ModelManager.create({at_ggroup: at_ggroup}, 'app.model.AutoTransport.NomenclatureModel');
					controller.nomenclatureStore.add(r);
				}
			},
			'#saveNomenclatureGroup': {
				click: function(){
					var selected=Ext.getCmp('nomenclatureGroupsTable').getSelectionModel().getSelection()[0];
					controller.syncMaster(
						controller.nomenclatureGroupStore,
						controller.nomenclatureStore,
						controller.nomenclatureContainer,
						(selected!=null)?selected.get('id'):null);
					return true;
				}
			},
			'#addNomenclatureGroup':{
				click: function(){
					var groupsTable = Ext.getCmp('nomenclatureGroupsTable'),
						sm=groupsTable.getSelectionModel(),
						selected=sm.getSelection()[0],
						at_ggtype=(selected!=null)?selected.get('at_ggtype'):null,
						r = Ext.ModelManager.create({at_ggtype: at_ggtype}, 'app.model.AutoTransport.NomenclatureGroupModel');
					controller.nomenclatureGroupStore.add(r);
					sm.select(r);
				}
			},
			'#refreshNomenclatureGroup': {
				click: controller.refreshNomenclatureGroup
			},
			'#deleteNomenclatureGroup': {
				click: function(button){
					var sm = Ext.getCmp('nomenclatureGroupsTable').getSelectionModel();
					
					controller.nomenclatureGroupStore.remove(sm.getSelection());
					if (controller.nomenclatureGroupStore.getCount() > 0) {
						sm.select(0);
					}
				}
			},
			'#deleteNomenclature': {
				click: function(button){
					var sm = Ext.getCmp('nomenclatureTable').getSelectionModel();
					
					controller.nomenclatureStore.remove(sm.getSelection()[0]);
					if (controller.nomenclatureGroupStore.getCount() > 0) {
						sm.select(0);
					}
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.nomenclatureStore=controller.getAutoTransportNomenclatureNomenclatureStore();
		controller.nomenclatureGroupStore=controller.getAutoTransportNomenclatureNomenclatureGroupStore();
		controller.nomenclatureGroupTypeStore=controller.getAutoTransportNomenclatureNomenclatureGroupTypeStore();
		controller.measureStore=controller.getAutoTransportMeasureStore();
		
		controller.measureStore.load();
		controller.refreshNomenclatureGroup();
	},
	
	bindStores: function(){
		var controller=this
			groupsTable=Ext.getCmp('nomenclatureGroupsTable');
		
		Ext.getCmp('nomenclatureTable').reconfigure(controller.nomenclatureStore);
		groupsTable.reconfigure(controller.nomenclatureGroupStore);
	},
	
	makeComboColumn: function(column, storeCombo, tableStore, property){
		function renderer(value){
			var matching = null;
			storeCombo.each(function(record){
				if(record.get('id')==value){
					matching=record.get('name');
				}
				return matching==null;
			});
			return matching;
		};
		
		column.field = Ext.create('Ext.form.ComboBox', {
			store: storeCombo,
			queryMode: 'local',
			displayField: 'name',
			valueField: 'id'
		});
		column.renderer=renderer;
		
		column.doSort = function(state){
			tableStore.sort({
				property: property,
				transform: renderer,
				direction: state
			});
			return true;
		};
	},
	
	initTables: function(){
		var controller=this,
			groupsTable = Ext.getCmp('nomenclatureGroupsTable'),
			nomenclatureTable = Ext.getCmp('nomenclatureTable'),
			columnGroupType = groupsTable.columns[1],
			measureColumn = nomenclatureTable.columns[1],
			groupColumn = nomenclatureTable.columns[2];
		
		controller.makeComboColumn(columnGroupType, controller.nomenclatureGroupTypeStore, controller.nomenclatureGroupStore, 'at_ggtype');
		controller.makeComboColumn(groupColumn, controller.nomenclatureGroupStore, controller.nomenclatureStore, 'at_ggroup');
		controller.makeComboColumn(measureColumn, controller.measureStore, controller.nomenclatureStore, 'measure');
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
		
		controller.initTables();
	}
});