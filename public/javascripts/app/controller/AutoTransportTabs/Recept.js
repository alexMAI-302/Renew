Ext.define('app.controller.AutoTransportTabs.Recept', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'AutoTransport.Recept.Recept',
		'AutoTransport.Recept.RecGoods',
		'AutoTransport.Ggroup',
		'AutoTransport.Goods',
		'AutoTransport.Recept.Truck',
		'AutoTransport.Measure'
	],
	
	models: [
		'valueModel',
		'AutoTransport.ReceptModel',
		'AutoTransport.GoodsModel'
	],
	
	views: [
		'AutoTransport.Container',
		'AutoTransport.Recept.Container'
	],
	
	receptContainer: null,
	
	detailStore: null,
	masterStore: null,
	ggroupStore: null,
	goodsStore: null,
	truckStore: null,
	measureStore: null,
	
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
	
	init: function() {
		var controller = this;
		
		controller.receptContainer=Ext.create('app.view.AutoTransport.Recept.Container');
		controller.receptContainer.addListener(
			"show",
			function(){
				controller.loadDictionaries();
			}
		);
		
		Ext.getCmp('AutoTransportMain').add(controller.receptContainer);
		
		controller.control({
			'#filterRecept': {
				click: function(button){
					controller.masterStore.proxy.extraParams={
						ddateb: Ext.getCmp('ddatebRecept').getValue(),
						ddatee: Ext.getCmp('ddateeRecept').getValue()
					};
					controller.masterStore.load(
						function(records, operation, success){
							if(!success){
								Ext.Msg.alert("Ошибка", "Ошибка при обновлении расходов");
							}
							return true;
						}
					);
				}
			},
			'#ReceptTable': {
				selectionchange: function(sm, selected, eOpts){
					if(selected!=null && selected.length>0){
						controller.loadDetail(
							selected[0].getId(),
							Ext.getCmp('RecGoodsTable')
						);
						Ext.getCmp('deleteRecept').setDisabled(false);
					} else {
						Ext.getCmp('RecGoodsTable').setDisabled(true);
						Ext.getCmp('deleteRecept').setDisabled(true);
					}
					return true;
				}
			},
			'#RecGoodsTable': {
				selectionchange: function(sm, selected, eOpts){
					Ext.getCmp('deleteRecGoods').setDisabled(selected==null || selected.length==0);
					return true;
				}
			},
			'#addRecGoods':{
				click: function(){
					var sm=Ext.getCmp('ReceptTable').getSelectionModel(),
						r = Ext.ModelManager.create({master_id: sm.getSelection()[0].getId()}, 'app.model.AutoTransport.GoodsModel');
					controller.detailStore.insert(0, r);
				}
			},
			'#saveRecept': {
				click: function(){
					var selected=Ext.getCmp('ReceptTable').getSelectionModel().getSelection()[0];
					controller.syncMaster(
						controller.receptContainer,
						(selected!=null)?
							((selected.getId()!=null)?
								selected.getId():
								selected.get('id')
							):
							null);
					return true;
				}
			},
			'#addRecept':{
				click: function(){
					var sm=Ext.getCmp('ReceptTable').getSelectionModel(),
						r = Ext.ModelManager.create({ddate: new Date()}, 'app.model.AutoTransport.ReceptModel');
					controller.masterStore.insert(0, r);
					sm.select(r);
				}
			},
			'#deleteRecept': {
				click: function(button){
					var sm = Ext.getCmp('ReceptTable').getSelectionModel();
					
					controller.masterStore.remove(sm.getSelection()[0]);
					if (controller.masterStore.getCount() > 0) {
						sm.select(0);
					}
				}
			},
			'#refreshRecGoods': {
				click: function(){
					var selected=Ext.getCmp('ReceptTable').getSelectionModel().getSelection();
					if(selected!=null && selected.length>0){
						controller.loadDetail(
							selected[0].getId(),
							Ext.getCmp('RecGoodsTable')
						);
					}
				}
			},
			'#deleteRecGoods': {
				click: function(button){
					var sm = Ext.getCmp('RecGoodsTable').getSelectionModel();
					
					controller.detailStore.remove(sm.getSelection()[0]);
					if (controller.detailStore.getCount() > 0) {
						sm.select(0);
					}
				}
			}
		});
	},
	
	loadDictionaries: function(){
		var controller=this;
		
		controller.ggroupStore.load();
		controller.goodsStore.proxy.extraParams={
			master_id: -1
		};
		controller.goodsStore.load();
		controller.measureStore.load();
		controller.truckStore.load();
	},
	
	initStores: function(){
		var controller=this,
			receptTable = Ext.getCmp('ReceptTable'),
			recGoodsTable = Ext.getCmp('RecGoodsTable');
		
		controller.masterStore=receptTable.store;
		controller.truckStore = controller.getAutoTransportReceptTruckStore();
		
		controller.detailStore=recGoodsTable.store;
		controller.ggroupStore=recGoodsTable.columns[0].store;
		controller.goodsStore=recGoodsTable.columns[1].store;
		controller.measureStore=recGoodsTable.columns[3].store;
		
		controller.loadDictionaries();
	},
	
	initTables: function(){
		var controller=this,
			receptTable = Ext.getCmp('ReceptTable'),
			recGoodsTable = Ext.getCmp('RecGoodsTable'),
			truckColumn = receptTable.columns[1],
			groupColumn = recGoodsTable.columns[0],
			goodsColumn = recGoodsTable.columns[1],
			measureColumn = recGoodsTable.columns[3];
		
		function renderer(value, metaData, r){
			var matching = null,
				data = controller.truckStore.snapshot || controller.truckStore.data;
			data.each(function(record){
				if(record.get('id')==value){
					matching=record.get('name');
				}
				return matching==null;
			});
			if (matching==null) {
				matching = r.get('truck_name');
			}
			return matching;
		};
		
		truckColumn.renderer = renderer;
		
		truckColumn.field = Ext.create('Ext.form.ComboBox', {
			store: controller.truckStore,
			queryMode: 'local',
			displayField: 'name',
			valueField: 'id',
			value: "",
			autoSelect: true,
			listeners: (config.fieldListeners!==false)?
				(config.fieldListeners || {
					beforequery: function(queryEvent){
						queryEvent.combo.store.clearFilter();
						queryEvent.combo.store.filter(queryEvent.combo.displayField, queryEvent.query);
						return true;
					}
				}) :null
				}
			);
		
		truckColumn.doSort = function(state){
			truckColumn.up('tablepanel').store.sort({
				property: 'name',
				transform: renderer,
				direction: state
			});
			return true;
		};
		
		goodsColumn.field.addListener(
			"select",
			function(combo, selected, eOpts){
				var r=recGoodsTable.getSelectionModel().getSelection()[0];
				r.set('measure', (selected[0]!=null)?selected[0].get('measure'):null);
				r.set('at_ggroup', (selected[0]!=null)?selected[0].get('at_ggroup'):null);
				return true;
			}
		);
		
		groupColumn.field.allowBlank=false;
		groupColumn.field.addListener(
			"select",
			function(combo, selected, eOpts){
				var r = recGoodsTable.getSelectionModel().getSelection()[0];
				r.set('at_goods', null);
				controller.goodsStore.clearFilter(true);
				if(selected[0]!=null){
					controller.goodsStore.filter("at_ggroup", selected[0].getId());
				}
				return true;
			}
		);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.initTables();
	}
});