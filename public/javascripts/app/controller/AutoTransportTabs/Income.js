Ext.define('app.controller.AutoTransportTabs.Income', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'AutoTransport.Income.Income',
		'AutoTransport.Income.IncGoods',
		'AutoTransport.Ggroup',
		'AutoTransport.Goods',
		'AutoTransport.Income.IncType',
		'AutoTransport.Measure'
	],
	
	models: [
		'valueModel',
		'AutoTransport.IncomeModel',
		'AutoTransport.GoodsModel',
		'AutoTransport.NomenclatureGroupModel'
	],
	
	views: [
		'AutoTransport.Container',
		'AutoTransport.Income.Container'
	],
	
	incomeContainer: null,
	
	incGoodsStore: null,
	incomeStore: null,
	ggroupStore: null,
	goodsStore: null,
	incTypeStore: null,
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
		
		controller.incomeContainer=Ext.create('app.view.AutoTransport.Income.Container');
		
		Ext.getCmp('AutoTransportMain').add(controller.incomeContainer);
		
		controller.control({
			'#filterIncome': {
				click: function(button){
					controller.incomeStore.proxy.extraParams={
						ddateb: Ext.getCmp('ddatebIncome').getValue(),
						ddatee: Ext.getCmp('ddateeIncome').getValue()
					};
					controller.incomeStore.load(
						function(records, operation, success){
							if(!success){
								Ext.Msg.alert("Ошибка", "Ошибка при обновлении приходов");
							}
							return true;
						}
					);
				}
			},
			'#incomeTable': {
				selectionchange: function(sm, selected, eOpts){
					if(selected!=null && selected.length>0){
						controller.incGoodsStore.proxy.extraParams={
							group_id: selected[0].get('id')
						};
						controller.incGoodsStore.load();
						Ext.getCmp('incGoodsTable').setDisabled(false);
					} else {
						Ext.getCmp('incGoodsTable').setDisabled(true);
					}
					return true;
				}
			},
			'#addIncGoods':{
				click: function(){
					var sm=Ext.getCmp('incomeTable').getSelectionModel(),
						r = Ext.ModelManager.create({at_income: sm.getSelection()[0].get('id')}, 'app.model.AutoTransport.GoodsModel');
					controller.incGoodsStore.add(r);
				}
			},
			'#saveIncome': {
				click: function(){
					var selected=Ext.getCmp('incomeTable').getSelectionModel().getSelection()[0];
					controller.syncMaster(
						controller.incomeStore,
						controller.incGoodsStore,
						controller.incomeContainer,
						(selected!=null)?selected.get('id'):null);
					return true;
				}
			},
			'#addIncome':{
				click: function(){
					var sm=Ext.getCmp('incomeTable').getSelectionModel(),
						r = Ext.ModelManager.create({ddate: new Date()}, 'app.model.AutoTransport.IncomeModel');
					controller.incomeStore.add(r);
					sm.select(r);
				}
			}
		});
	},
	
	initStores: function(){
		var controller=this;
		
		controller.incGoodsStore=controller.getAutoTransportIncomeIncGoodsStore();
		controller.incomeStore=controller.getAutoTransportIncomeIncomeStore();
		controller.ggroupStore=controller.getAutoTransportGgroupStore();
		controller.goodsStore=controller.getAutoTransportGoodsStore();
		controller.incTypeStore=controller.getAutoTransportIncomeIncTypeStore();
		controller.measureStore=controller.getAutoTransportMeasureStore();
		
		controller.ggroupStore.load();
		controller.goodsStore.load();
		controller.measureStore.load();
	},
	
	bindStores: function(){
		var controller=this,
			incomeTable=Ext.getCmp('incomeTable');
		
		Ext.getCmp('incGoodsTable').reconfigure(controller.incGoodsStore);
		incomeTable.reconfigure(controller.incomeStore);
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
			incomeTable = Ext.getCmp('incomeTable'),
			incGoodsTable = Ext.getCmp('incGoodsTable'),
			typeColumn = incomeTable.columns[1],
			groupColumn = incGoodsTable.columns[0],
			goodsColumn = incGoodsTable.columns[1],
			measureColumn = incGoodsTable.columns[3];
		
		controller.makeComboColumn(typeColumn, controller.incTypeStore, controller.incomeStore, 'type');
		controller.makeComboColumn(groupColumn, controller.ggroupStore, controller.incGoodsStore, 'at_ggroup');
		controller.makeComboColumn(goodsColumn, controller.goodsStore, controller.incGoodsStore, 'at_goods');
		controller.makeComboColumn(measureColumn, controller.measureStore, controller.incGoodsStore, 'measure', true);
		
		goodsColumn.field.addListener(
			"select",
			function(combo, selected, eOpts){
				var r=incGoodsTable.getSelectionModel().getSelection()[0],
					s=selected[0];
				r.set('at_ggroup', (s!=null)?s.get('at_ggroup'):null);
				r.set('measure', (s!=null)?s.get('measure'):null);
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