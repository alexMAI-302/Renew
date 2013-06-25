Ext.define('app.controller.AutoTransportTabs.Nomenclature', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'AutoTransport.Nomenclature.Nomenclature',
		'AutoTransport.Nomenclature.NomenclatureGroup',
		'AutoTransport.Measure'
	],
	
	models: [
		'valueModel',
		'AutoTransport.NomenclatureModel'
	],
	
	views: [
		'AutoTransport.Container',
		'AutoTransport.Nomenclature.Container'
	],
	
	nomenclatureContainer: null,
	
	detailStore: null,
	masterStore: null,
	measureStore: null,
	comboStore: null,
	
	refreshNomenclatureGroup: function(){
		var controller=this;
		
		controller.masterStore.load();
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
					if(selected!=null && selected.length>0 && selected[0].isLeaf()){
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
						at_ggtype=(selected!=null)?(selected.isLeaf()?selected.parentNode:selected):null,
						r;
					if(at_ggtype==null){
						at_ggtype = controller.masterStore.getRootNode().firstChild;
					}
					r = at_ggtype.insertChild(0, {leaf: true});
					sm.select(r);
				}
			},
			'#refreshNomenclatureGroup': {
				click: controller.refreshNomenclatureGroup
			},
			'#deleteNomenclatureGroup': {
				click: function(button){
					var sm = Ext.getCmp('NomenclatureGroupTable').getSelectionModel(),
						selected = sm.getSelection();
					
					if(selected[0].isLeaf()){
						var parent = selected[0].parentNode;
						parent.removeChild(selected[0]);
						if (parent.firstChild != null) {
							sm.select(parent.firstChild);
						}
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
		var controller=this,
			nomenclatureTable = Ext.getCmp('NomenclatureTable');
		
		controller.detailStore=nomenclatureTable.getStore();
		controller.masterStore=Ext.getCmp('NomenclatureGroupTable').getStore();
		controller.measureStore=nomenclatureTable.columns[1].store;
		controller.comboStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'memory'
			}
		});
		
		controller.masterStore.addListener(
			"datachanged",
			function(store, eOpts){
				var root=store.getRootNode();
				controller.comboStore.removeAll();
				if(root!=null && root.firstChild!=null){
					root.eachChild(
						function(type){
							if(type!=null && type.firstChild!=null){
								type.eachChild(
									function(group){
										controller.comboStore.add({
											id: group.get("id"),
											name: group.get("name")
										});
									}
								)
							}
						}
					)
				}
			}
		);
		
		controller.measureStore.load();
	},
	
	initTables: function(){
		var controller=this,
			nomenclatureTable = Ext.getCmp('NomenclatureTable'),
			groupColumn = nomenclatureTable.columns[2];
		
		nomenclatureTable.makeComboColumn(groupColumn, controller.comboStore);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.initTables();
	}
});