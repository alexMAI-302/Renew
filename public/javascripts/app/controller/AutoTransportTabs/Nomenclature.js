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
	
	detailStore: null,
	masterStore: null,
	nomenclatureGroupTypeStore: null,
	measureStore: null,
	
	refreshNomenclatureGroup: function(){
		var controller=this;
		
		controller.nomenclatureGroupTypeStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке типов групп номенклатуры");
				} else {
					controller.masterStore.load(
						function(records1, operation1, success1){
							if(!success1){
								Ext.Msg.alert("Ошибка", "Ошибка при загрузке групп номенклатуры");
							} else {
								var r=Ext.getCmp('NomenclatureGroupTable').getSelectionModel().getSelection()[0];
								if(r!=null) {
									controller.detailStore.extraParams={
										group_id: r.get('id')
									};
									controller.detailStore.load(
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
	
	init: function() {
		var controller = this,
			mainContainer = Ext.getCmp('AutoTransportMain');
		
		controller.nomenclatureContainer=Ext.create('app.view.AutoTransport.Nomenclature.Container');
		
		mainContainer.add(controller.nomenclatureContainer);
		mainContainer.setActiveTab(controller.nomenclatureContainer);
		
		controller.control({
			'#NomenclatureGroupTable': {
				selectionchange: function(sm, selected, eOpts){
					if(selected!=null && selected.length>0){
						controller.detailStore.proxy.extraParams={
							master_id: selected[0].get('id')
						};
						controller.detailStore.load();
						Ext.getCmp('deleteNomenclatureGroup').setDisabled(false);
						Ext.getCmp('NomenclatureTable').setDisabled(false);
					} else {
						Ext.getCmp('deleteNomenclatureGroup').setDisabled(true);
						Ext.getCmp('NomenclatureTable').setDisabled(true);
					}
					return true;
				}
			},
			'#NomenclatureTable': {
				selectionchange: function(sm, selected, eOpts){
					Ext.getCmp('deleteNomenclature').setDisabled(selected==null || selected.length==0);
					return true;
				}
			},
			'#addNomenclature':{
				click: function(){
					var sm=Ext.getCmp('NomenclatureGroupTable').getSelectionModel(),
						selected=sm.getSelection()[0],
						at_ggroup=(selected!=null)?selected.get('id'):null,
						r = Ext.ModelManager.create({at_ggroup: at_ggroup}, 'app.model.AutoTransport.NomenclatureModel');
					controller.detailStore.add(r);
				}
			},
			'#saveNomenclatureGroup': {
				click: function(){
					var selected=Ext.getCmp('NomenclatureGroupTable').getSelectionModel().getSelection()[0];
					controller.syncMaster(
						controller.nomenclatureContainer,
						((selected!=null)?
							((selected.getId()!=null)?
								selected.getId():
								selected.get('id')
							):
							null));
					return true;
				}
			},
			'#addNomenclatureGroup':{
				click: function(){
					var groupsTable = Ext.getCmp('NomenclatureGroupTable'),
						sm=groupsTable.getSelectionModel(),
						selected=sm.getSelection()[0],
						at_ggtype=(selected!=null)?selected.get('at_ggtype'):null,
						r = Ext.ModelManager.create({at_ggtype: at_ggtype}, 'app.model.AutoTransport.NomenclatureGroupModel');
					controller.masterStore.add(r);
					sm.select(r);
				}
			},
			'#refreshNomenclatureGroup': {
				click: controller.refreshNomenclatureGroup
			},
			'#deleteNomenclatureGroup': {
				click: function(button){
					var sm = Ext.getCmp('NomenclatureGroupTable').getSelectionModel();
					
					controller.masterStore.remove(sm.getSelection());
					if (controller.masterStore.getCount() > 0) {
						sm.select(0);
					}
				}
			},
			'#deleteNomenclature': {
				click: function(button){
					var sm = Ext.getCmp('NomenclatureTable').getSelectionModel();
					
					controller.detailStore.remove(sm.getSelection()[0]);
					if (controller.detailStore.getCount() > 0) {
						sm.select(0);
					}
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.detailStore=controller.getAutoTransportNomenclatureNomenclatureStore();
		controller.masterStore=controller.getAutoTransportNomenclatureNomenclatureGroupStore();
		controller.nomenclatureGroupTypeStore=controller.getAutoTransportNomenclatureNomenclatureGroupTypeStore();
		controller.measureStore=controller.getAutoTransportMeasureStore();
		
		controller.measureStore.load();
		controller.refreshNomenclatureGroup();
	},
	
	bindStores: function(){
		var controller=this,
			groupsTable=Ext.getCmp('NomenclatureGroupTable');
		
		Ext.getCmp('NomenclatureTable').reconfigure(controller.detailStore);
		groupsTable.reconfigure(controller.masterStore);
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
			groupsTable = Ext.getCmp('NomenclatureGroupTable'),
			nomenclatureTable = Ext.getCmp('NomenclatureTable'),
			columnGroupType = groupsTable.columns[1],
			measureColumn = nomenclatureTable.columns[1],
			groupColumn = nomenclatureTable.columns[2];
		
		controller.makeComboColumn(columnGroupType, controller.nomenclatureGroupTypeStore, controller.masterStore, 'at_ggtype');
		controller.makeComboColumn(groupColumn, controller.masterStore, controller.detailStore, 'at_ggroup');
		controller.makeComboColumn(measureColumn, controller.measureStore, controller.detailStore, 'measure');
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
		
		controller.initTables();
	}
});