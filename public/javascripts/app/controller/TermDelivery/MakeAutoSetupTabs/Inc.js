Ext.define('app.controller.TermDelivery.MakeAutoSetupTabs.Inc', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'AutoTransport.Income.Income',
		'AutoTransport.Income.IncGoods',
		'AutoTransport.Ggroup',
		'AutoTransport.Goods',
		'AutoTransport.Income.IncType',
		'AutoTransport.Measure',
		'AutoTransport.Sellers'
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
	
	incContainer: null,
	
	detailStore: null,
	masterStore: null,
	ggroupStore: null,
	goodsStore: null,
	incTypeStore: null,
	measureStore: null,
	
	init: function() {
		var controller = this;
		
		controller.incContainer=Ext.create('app.view.AutoTransport.Income.Container');
		controller.incContainer.addListener(
			"show",
			function(){
				controller.loadDictionaries();
			}
		);
		
		Ext.getCmp('AutoTransportMain').add(controller.incContainer);
		
		function getId(r){
			return (r!=null)?
					((r.getId()!=null && r.getId()!=0)?
						r.getId():
						r.get('id')
					):
					null;
		}
		
		controller.control({
			'#filterIncome': {
				click: function(button){
					controller.masterStore.proxy.extraParams={
						ddateb: Ext.getCmp('ddatebIncome').getValue(),
						ddatee: Ext.getCmp('ddateeIncome').getValue()
					};
					controller.masterStore.load(
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
						controller.loadDetail(
							getId(selected[0]),
							Ext.getCmp('incGoodsTable')
						);
					} else {
						Ext.getCmp('incGoodsTable').setDisabled(true);
					}
					return true;
				}
			},
			'#addIncGoods':{
				click: function(){
					var sm=Ext.getCmp('incomeTable').getSelectionModel(),
						r = Ext.ModelManager.create({master_id: sm.getSelection()[0].getId()}, 'app.model.AutoTransport.GoodsModel');
					controller.detailStore.add(r);
				}
			},
			'#saveIncome': {
				click: function(){
					var selected=Ext.getCmp('incomeTable').getSelectionModel().getSelection()[0];
					if(selected != null){
						selected.set('sum', controller.detailStore.sum('sum'));
					}
					controller.syncMaster(
						controller.incContainer,
						getId(selected));
					return true;
				}
			},
			'#addIncome':{
				click: function(){
					var sm=Ext.getCmp('incomeTable').getSelectionModel(),
						r = Ext.ModelManager.create({ddate: new Date()}, 'app.model.AutoTransport.IncomeModel');
					controller.masterStore.add(r);
					sm.select(r);
				}
			},
			'#refreshIncGoods': {
				click: function(){
					var selected=Ext.getCmp('incomeTable').getSelectionModel().getSelection();
					if(selected!=null && selected.length>0){
						controller.loadDetail(
							getId(selected[0]),
							Ext.getCmp('incGoodsTable')
						);
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
		controller.sellersStore.load();
	},
	
	initStores: function(){
		var controller=this;
		
		controller.detailStore=controller.getAutoTransportIncomeIncGoodsStore();
		controller.masterStore=controller.getAutoTransportIncomeIncomeStore();
		controller.ggroupStore=controller.getAutoTransportGgroupStore();
		controller.goodsStore=controller.getAutoTransportGoodsStore();
		controller.incTypeStore=controller.getAutoTransportIncomeIncTypeStore();
		controller.measureStore=controller.getAutoTransportMeasureStore();
		controller.sellersStore=controller.getAutoTransportSellersStore();
		
		controller.loadDictionaries();
	},
	
	bindStores: function(){
		var controller=this,
			incomeTable=Ext.getCmp('incomeTable');
		
		Ext.getCmp('incGoodsTable').reconfigure(controller.detailStore);
		incomeTable.reconfigure(controller.masterStore);
	},
	
	makeComboColumn: function(column, storeCombo, tableStore, property, allowNull, onlyRenderer){
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
				autoSelect: (allowNull!==true)
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
			sellerColumn = incomeTable.columns[2],
			groupColumn = incGoodsTable.columns[0],
			goodsColumn = incGoodsTable.columns[1],
			measureColumn = incGoodsTable.columns[3];
		
		controller.makeComboColumn(typeColumn, controller.incTypeStore, controller.masterStore, 'type');
		controller.makeComboColumn(sellerColumn, controller.sellersStore, controller.masterStore, 'at_seller', true);
		controller.makeComboColumn(groupColumn, controller.ggroupStore, controller.detailStore, 'at_ggroup');
		controller.makeComboColumn(goodsColumn, controller.goodsStore, controller.detailStore, 'at_goods');
		controller.makeComboColumn(measureColumn, controller.measureStore, controller.detailStore, 'measure', false, true);
		
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
		
		groupColumn.field.allowBlank=false;
		groupColumn.field.addListener(
			"select",
			function(combo, selected, eOpts){
				var r = incGoodsTable.getSelectionModel().getSelection()[0];
				r.set('at_goods', null);
				controller.goodsStore.clearFilter(true);
				if(selected[0]!=null){
					controller.goodsStore.filter("at_ggroup", selected[0].get('id'));
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