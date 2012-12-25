Ext.define('app.controller.Comp', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'Comp.CompLocations',
		'Comp.Components',
		'Comp.Operations',
		'Comp.Terminals',
		'Comp.Types',
		'Comp.Persons'
	],
	
	models: [
		'valueModel',
		'Comp.ComponentModel'
	],
	
	views: [
		'Comp.Container'
	],
	
	mainContainer: null,
	
	compLocationsStore:null,
	compStore:null,
	typesStore:null,
	terminalsStore:null,
	operationsStore:null,
	
	syncMaster: function(masterStore, detailStore, container, selectedMasterId){
		function syncDetail(detailStore, container){
			if (
				(detailStore.getNewRecords().length > 0) ||
				(detailStore.getUpdatedRecords().length > 0) ||
				(detailStore.getRemovedRecords().length > 0)){
				
				if(selectedMasterId!=null){
					detailStore.exrtaParams = {
						master_id: selectedMasterId
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
	
	loadDetail: function(masterId, detailStore, detailTable){
		detailStore.proxy.extraParams={
			master_id: masterId
		};
		detailStore.load(
			function(){
				detailTable.setDisabled(false);
			}
		);
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.Comp.Container');
		
		controller.control({
			'#filterComp': {
				click: function(button){
					controller.compStore.proxy.extraParams={
						type: Ext.getCmp('filterTypeComp').getValue(),
						comp_location: Ext.getCmp('filterCompLocationComp').getValue(),
						terminal: Ext.getCmp('filterTerminalComp').getValue(),
						serial: Ext.getCmp('filterSerialComp').getValue()
					};
					controller.compStore.load(
						function(records, operation, success){
							if(!success){
								Ext.Msg.alert("Ошибка", "Ошибка при обновлении приходов");
							}
							return true;
						}
					);
				}
			},
			'#compTable': {
				selectionchange: function(sm, selected, eOpts){
					if(selected!=null && selected.length==1){
						controller.loadDetail(
							selected[0].get('id'),
							controller.operationsStore,
							Ext.getCmp('operationsTable')
						);
					} else {
						Ext.getCmp('operationsTable').setDisabled(true);
					}
					Ext.getCmp('actionPanel').setDisabled(selected==null || selected.length==0);
					return true;
				}
			},
			'#refreshIncGoods': {
				click: function(){
					var selected=Ext.getCmp('compTable').getSelectionModel().getSelection();
					if(selected!=null && selected.length>0){
						controller.loadDetail(
							selected[0].get('id'),
							controller.compLocationsStore,
							Ext.getCmp('operationsTable')
						);
					}
				}
			},
			'#actionMoveComp': {
				click: function(){
					var selection = Ext.getCmp('compTable').getSelectionModel().getSelection();
					var ids=[];
					
					for(var i=0; i<selection.length; i++){
						ids.push({id: selection[i].get('id')});
					}
					
					controller.mainContainer.setDisabled(true);
					
					Ext.Ajax.request({
						url: '/comp/create_operations',
						timeout: 300000,
						params: {
							destination: Ext.getCmp('actionDestinationComp').getValue(),
							person: Ext.getCmp('actionPersonComp').getValue(),
							terminal: Ext.getCmp('actionTerminalComp').getValue(),
							descr: Ext.getCmp('actionDescrComp').getValue()
						},
						jsonData: {
							comp_ids:  ids
						},
						method: "POST",
						callback: function(options, success, response){
							if(success===true){
								controller.compStore.load();
							} else {
								Ext.Msg.alert("Ошибка", response.responseText);
							}
							controller.mainContainer.setDisabled(false);
						}
					});
				}
			}
		});
		
		Ext.getCmp('compTable').getPlugin('rowEditingComp').addListener(
			"edit",
			function(editor, e, eOpts){
				controller.compStore.proxy.extraParams={};
				controller.compStore.sync({
					callback: function(batch){
						if(batch.exceptions.length>0){
							Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
						}
					}
				});
			}
		)
	},
	
	loadDictionaries: function(){
		var controller=this,
			count=4;
		
		controller.mainContainer.setLoading(true);
		function checkLoading(val){
			if(val==0){
				controller.mainContainer.setLoading(false);
			}
		};
		
		controller.compLocationsStore.load(
			function(success){
				count--;
				checkLoading(count);
			}
		);
		controller.typesStore.load(
			function(success){
				count--;
				checkLoading(count);
			}
		);
		controller.personsStore.load(
			function(success){
				count--;
				checkLoading(count);
			}
		);
		controller.terminalsStore.load(
			function(success){
				count--;
				checkLoading(count);
			}
		);
	},
	
	initStores: function(){
		var controller=this;
		
		controller.compLocationsStore=controller.getCompCompLocationsStore();
		controller.compStore=controller.getCompComponentsStore();
		controller.typesStore=controller.getCompTypesStore();
		controller.terminalsStore=controller.getCompTerminalsStore();
		controller.operationsStore=controller.getCompOperationsStore();
		controller.personsStore=controller.getCompPersonsStore();
		
		controller.loadDictionaries();
	},
	
	bindStores: function(){
		var controller=this,
			compTable=Ext.getCmp('compTable');
		
		Ext.getCmp('operationsTable').reconfigure(controller.operationsStore);
		compTable.reconfigure(controller.compStore);
		
		Ext.getCmp('filterTypeComp').bindStore(controller.typesStore);
		Ext.getCmp('filterCompLocationComp').bindStore(controller.compLocationsStore);
		Ext.getCmp('filterTerminalComp').bindStore(controller.terminalsStore);
		
		Ext.getCmp('actionDestinationComp').bindStore(controller.compLocationsStore);
		Ext.getCmp('actionPersonComp').bindStore(controller.personsStore);
		Ext.getCmp('actionTerminalComp').bindStore(controller.terminalsStore);
	},
	
	makeComboColumn: function(column, storeCombo, tableStore, property, onlyRenderer){
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
		
		if(!onlyRenderer){
			column.field = Ext.create('Ext.form.ComboBox', {
				store: storeCombo,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				value: ""
			});
		}
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
			compTable = Ext.getCmp('compTable'),
			operationsTable = Ext.getCmp('operationsTable'),
			typeColumn = compTable.columns[0],
			sourceColumn = operationsTable.columns[2],
			destinationColumn = operationsTable.columns[3],
			terminalColumn = operationsTable.columns[4],
			personColumn = operationsTable.columns[5];
		
		controller.makeComboColumn(typeColumn, controller.typesStore, controller.compStore, 'type');
		controller.makeComboColumn(sourceColumn, controller.compLocationsStore, controller.operationsStore, 'source');
		controller.makeComboColumn(destinationColumn, controller.compLocationsStore, controller.operationsStore, 'destination');
		controller.makeComboColumn(terminalColumn, controller.terminalsStore, controller.operationsStore, 'terminal');
		controller.makeComboColumn(personColumn, controller.personsStore, controller.operationsStore, 'terminal');
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
		
		controller.initTables();
	}
});