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
	
	selectedComp: null,
	
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
	
	filterComp: function(){
		var controller=this;
		
		controller.compStore.proxy.extraParams={
			type: Ext.getCmp('filterTypeComp').getValue(),
			comp_location: Ext.getCmp('filterCompLocationComp').getValue(),
			terminal: Ext.getCmp('filterTerminalComp').getValue(),
			serial: Ext.getCmp('filterSerialComp').getValue(),
			person_id: Ext.getCmp('filterPersonComp').getValue(),
		};
		controller.compStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при получении комплектующих");
				}
				return true;
			}
		);
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.Comp.Container');
		
		controller.control({
			'#filterComp': {
				click: controller.filterComp
			},
			'#CompTable': {
				selectionchange: function(sm, selected, eOpts){
					if(selected!=null && selected.length==1){
						var selectedId=selected[0].get('id');
						
						if(selectedId!=controller.selectedComp && !selected[0].phantom){
							controller.selectedComp=selectedId;
							controller.loadDetail(
								selectedId,
								controller.operationsStore,
								Ext.getCmp('OperationsTable')
							);
						} else {
							Ext.getCmp('OperationsTable').setDisabled(false);
						}
					} else {
						Ext.getCmp('OperationsTable').setDisabled(true);
					}
					Ext.getCmp('actionPanel').setDisabled(selected==null || selected.length==0 || selected[0].phantom);
					return true;
				}
			},
			'#addComp':{
				click: function(){
					var r = Ext.ModelManager.create({serial:'бн'}, 'app.model.Comp.ComponentModel');
					controller.compStore.add(r);
					Ext.getCmp('CompTable').getPlugin('rowEditingComp').startEdit(r, 0);
					Ext.getCmp('addComp').setDisabled(true);
				}
			},
			'#actionMoveComp': {
				click: function(){
					var selection = Ext.getCmp('CompTable').getSelectionModel().getSelection(),
						ids=[],
						destination = Ext.getCmp('actionDestinationComp').getValue();
					
					for(var i=0; i<selection.length; i++){
						ids.push({id: selection[i].get('id')});
						selection[i].set('state', destination);
					}
					
					controller.mainContainer.setDisabled(true);
					
					Ext.Ajax.request({
						url: '/comp/create_operations',
						timeout: 300000,
						params: {
							destination: destination,
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
								if(selection.length==1){
									controller.loadDetail(
										selection[0].get('id'),
										controller.operationsStore,
										Ext.getCmp('OperationsTable')
									);
								}
							} else {
								Ext.Msg.alert("Ошибка", response.responseText);
							}
							controller.mainContainer.setDisabled(false);
						}
					});
				}
			},
			'#refreshOperations': {
				click: function(){
					var selection = Ext.getCmp('CompTable').getSelectionModel().getSelection();
					controller.loadDetail(
						selection[0].get('id'),
						controller.operationsStore,
						Ext.getCmp('OperationsTable')
					);
				}
			}
		});
		
		Ext.getCmp('CompTable').getPlugin('rowEditingComp').addListener(
			"edit",
			function(editor, e, eOpts){
				controller.compStore.proxy.extraParams={};
				if(!e.record.phantom){
					e.record.set('state', e.originalValues.state);
				}
				controller.compStore.sync({
					callback: function(batch){
						if(batch.exceptions.length>0){
							Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
						}
					}
				});
				Ext.getCmp('addComp').setDisabled(false);
				return true;
			}
		);
		Ext.getCmp('CompTable').getPlugin('rowEditingComp').addListener(
			"canceledit",
			function(editor, e, eOpts){
				if(e.record.phantom){
					controller.compStore.remove(e.record);
					Ext.getCmp('addComp').setDisabled(false);
				}
				return true;
			}
		);
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
			compTable=Ext.getCmp('CompTable');
		
		Ext.getCmp('OperationsTable').reconfigure(controller.operationsStore);
		compTable.reconfigure(controller.compStore);
		
		Ext.getCmp('filterTypeComp').bindStore(controller.typesStore);
		Ext.getCmp('filterCompLocationComp').bindStore(controller.compLocationsStore);
		Ext.getCmp('filterTerminalComp').bindStore(controller.terminalsStore);
		Ext.getCmp('filterPersonComp').bindStore(controller.personsStore);
		
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
				value: "",
				listeners: {
					select: function(field){
						field.getStore().clearFilter(true);
						return true;
					}
				}
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
			compTable = Ext.getCmp('CompTable'),
			operationsTable = Ext.getCmp('OperationsTable'),
			typeColumn = compTable.columns[0],
			stateColumn = compTable.columns[2],
			compPersonColumn = compTable.columns[3];
			sourceColumn = operationsTable.columns[2],
			destinationColumn = operationsTable.columns[3],
			terminalColumn = operationsTable.columns[4],
			personColumn = operationsTable.columns[5];
		
		controller.makeComboColumn(typeColumn, controller.typesStore, controller.compStore, 'type');
		controller.makeComboColumn(stateColumn, controller.compLocationsStore, controller.compStore, 'state');
		controller.makeComboColumn(compPersonColumn, controller.personsStore, controller.operationsStore, 'person');
		
		controller.makeComboColumn(sourceColumn, controller.compLocationsStore, controller.operationsStore, 'source', true);
		controller.makeComboColumn(destinationColumn, controller.compLocationsStore, controller.operationsStore, 'destination', true);
		controller.makeComboColumn(terminalColumn, controller.terminalsStore, controller.operationsStore, 'terminal', true);
		controller.makeComboColumn(personColumn, controller.personsStore, controller.operationsStore, 'person', true);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
		
		controller.initTables();
	}
});