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
		'AutoTransport.GoodsModel',
		'AutoTransport.NomenclatureGroupModel'
	],
	
	views: [
		'AutoTransport.Container',
		'AutoTransport.Recept.Container'
	],
	
	receptContainer: null,
	
	recGoodsStore: null,
	receptStore: null,
	ggroupStore: null,
	goodsStore: null,
	truckStore: null,
	measureStore: null,
	
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
		
		controller.receptContainer=Ext.create('app.view.AutoTransport.Recept.Container');
		
		Ext.getCmp('AutoTransportMain').add(controller.receptContainer);
		
		controller.control({
			'#filterRecept': {
				click: function(button){
					controller.receptStore.proxy.extraParams={
						ddateb: Ext.getCmp('ddatebRecept').getValue(),
						ddatee: Ext.getCmp('ddateeRecept').getValue()
					};
					controller.receptStore.load(
						function(records, operation, success){
							if(!success){
								Ext.Msg.alert("Ошибка", "Ошибка при обновлении расходов");
							}
							return true;
						}
					);
				}
			},
			'#receptTable': {
				selectionchange: function(sm, selected, eOpts){
					if(selected!=null && selected.length>0){
						controller.recGoodsStore.proxy.extraParams={
							group_id: selected[0].get('id')
						};
						controller.recGoodsStore.load();
						Ext.getCmp('recGoodsTable').setDisabled(false);
					} else {
						Ext.getCmp('recGoodsTable').setDisabled(true);
					}
					return true;
				}
			},
			'#addRecGoods':{
				click: function(){
					var sm=Ext.getCmp('receptTable').getSelectionModel(),
						r = Ext.ModelManager.create({at_income: sm.getSelection()[0].get('id')}, 'app.model.AutoTransport.GoodsModel');
					controller.recGoodsStore.add(r);
				}
			},
			'#saveRecept': {
				click: function(){
					var selected=Ext.getCmp('receptTable').getSelectionModel().getSelection()[0];
					controller.syncMaster(
						controller.receptStore,
						controller.recGoodsStore,
						controller.receptContainer,
						(selected!=null)?selected.get('id'):null);
					return true;
				}
			},
			'#addRecept':{
				click: function(){
					var sm=Ext.getCmp('receptTable').getSelectionModel(),
						r = Ext.ModelManager.create({ddate: new Date()}, 'app.model.AutoTransport.ReceptModel');
					controller.receptStore.add(r);
					sm.select(r);
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.recGoodsStore=controller.getAutoTransportReceptRecGoodsStore();
		controller.receptStore=controller.getAutoTransportReceptReceptStore();
		controller.ggroupStore=controller.getAutoTransportGgroupStore();
		controller.goodsStore=controller.getAutoTransportGoodsStore();
		controller.truckStore=controller.getAutoTransportReceptTruckStore();
		controller.measureStore=controller.getAutoTransportMeasureStore();
		
		controller.ggroupStore.load();
		controller.goodsStore.load();
		controller.measureStore.load();
	},
	
	bindStores: function(){
		var controller=this,
			receptTable=Ext.getCmp('receptTable');
		
		Ext.getCmp('recGoodsTable').reconfigure(controller.recGoodsStore);
		receptTable.reconfigure(controller.receptStore);
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
			receptTable = Ext.getCmp('receptTable'),
			recGoodsTable = Ext.getCmp('recGoodsTable'),
			truckColumn = receptTable.columns[1],
			groupColumn = recGoodsTable.columns[0],
			goodsColumn = recGoodsTable.columns[1],
			measureColumn = recGoodsTable.columns[3];
		
		controller.makeComboColumn(groupColumn, controller.ggroupStore, controller.recGoodsStore, 'at_ggroup');
		controller.makeComboColumn(goodsColumn, controller.goodsStore, controller.recGoodsStore, 'at_goods');
		controller.makeComboColumn(measureColumn, controller.measureStore, controller.recGoodsStore, 'measure', true);
		
		truckColumn.field = Ext.create('Ext.form.ComboBox', {
			store: controller.truckStore,
			queryMode: 'remote',
			displayField: 'name',
			valueField: 'id',
			value: "",
			listeners: {
				select: function(combo, selected, eOpts){
					var r=receptTable.getSelectionModel().getSelection()[0];
					r.set('truck_name', (selected[0]!=null)?selected[0].get('name'):null);
					return true;
				}
			}
		});
		truckColumn.renderer = function(value, metaData, record){
			return record.get('truck_name');
		};
		truckColumn.doSort = function(state){
			controller.receptStore.sort({
				property: 'truck_name',
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
		goodsColumn.field.addListener(
			"beforeQuery",
			function(queryEvent, eOpts){
				queryEvent.combo.store.clearFilter(true);
				return true;
			}
		);
		
		groupColumn.field.allowBlank=false;
		groupColumn.field.addListener(
			"select",
			function(combo, selected, eOpts){
				controller.goodsStore.clearFilter(true);
				if(selected[0]!=null){
					controller.goodsStore.filter("at_ggroup", selected[0].get("id"));
				}
				return true;
			}
		);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
		
		controller.initTables();
	}
});