Ext.define('app.controller.AutoTransportTabs.Nomenclature', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'AutoTransport.Nomenclature',
		'AutoTransport.NomenclatureGroup',
		'AutoTransport.NomenclatureGroupType',
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
							}
						}
					);
				}
			}
		);
	},
	
	init: function() {
		var controller = this,
			nomenclatureFolder = '/ext/resources/themes/images/default/tree/folder-open.gif',
			nomenclatureList = '/ext/resources/themes/images/default/tree/leaf.gif';
		
		controller.nomenclatureContainer=Ext.create('app.view.AutoTransport.Nomenclature.Container');
		
		Ext.getCmp('AutoTransportMain').add(controller.nomenclatureContainer);
		
		controller.control({
			'#nomenclatureGroupsTable': {
				selectionchange: function(sm, selected, eOpts){
					controller.nomenclatureStore.proxy.extraParams={
						group_id: selected[0].get('id')
					};
					controller.nomenclatureStore.load();
					return true;
				}
			},
			'#addNomenclature':{
				click: function(){
					var selected=Ext.getCmp('nomenclatureGroupsTable').getSelectionModel().getSelection()[0],
						at_ggroup=(selected!=null)?selected.get('id'):null,
						r = Ext.ModelManager.create({at_ggroup: at_ggroup}, 'app.model.AutoTransport.NomenclatureModel');
					controller.nomenclatureStore.add(r);
				}
			},
			'#saveNomenclature': {
				click: function(){
					controller.nomenclatureContainer.setLoading(true);
					controller.nomenclatureStore.sync({
						callback: function(){
							controller.nomenclatureContainer.setLoading(false);
						}
					});
					return true;
				}
			},
			'#addNomenclatureGroup':{
				click: function(){
					var groupsTable = Ext.getCmp('nomenclatureGroupsTable'),
						selected=groupsTable.getSelectionModel().getSelection()[0],
						at_ggtype=(selected!=null)?selected.get('at_ggtype'):null,
						r = Ext.ModelManager.create({at_ggtype: at_ggtype}, 'app.model.AutoTransport.NomenclatureGroupModel');
					controller.nomenclatureGroupStore.add(r);
				}
			},
			'#saveNomenclatureGroup': {
				click: function(){
					controller.nomenclatureContainer.setLoading(true);
					controller.nomenclatureGroupStore.sync({
						callback: function(){
							controller.nomenclatureContainer.setLoading(false);
						}
					});
					return true;
				}
			},
			'#refreshNomenclatureGroup': {
				click: controller.refreshNomenclatureGroup
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.nomenclatureStore=controller.getAutoTransportNomenclatureStore();
		controller.nomenclatureGroupStore=controller.getAutoTransportNomenclatureGroupStore();
		controller.nomenclatureGroupTypeStore=controller.getAutoTransportNomenclatureGroupTypeStore();
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
			columnGroupDelete = groupsTable.columns[0],
			columnGroupType = groupsTable.columns[2],
			measureColumn = nomenclatureTable.columns[1],
			groupColumn = nomenclatureTable.columns[2],
			columnDelete = nomenclatureTable.columns[3];
		
		controller.makeComboColumn(columnGroupType, controller.nomenclatureGroupTypeStore, controller.nomenclatureGroupStore, 'at_ggtype');
		controller.makeComboColumn(groupColumn, controller.nomenclatureGroupStore, controller.nomenclatureStore, 'at_ggroup');
		controller.makeComboColumn(measureColumn, controller.measureStore, controller.nomenclatureStore, 'measure');
		
		columnGroupDelete.handler = function(grid, rowIndex, colIndex) {
			var currentRecord=grid.store.getAt(rowIndex);
			
			controller.nomenclatureGroupStore.remove(currentRecord);
		};
		
		columnDelete.handler = function(grid, rowIndex, colIndex) {
			var currentRecord=grid.store.getAt(rowIndex);
			
			controller.nomenclatureStore.remove(currentRecord);
		};
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
		
		controller.initTables();
	}
});