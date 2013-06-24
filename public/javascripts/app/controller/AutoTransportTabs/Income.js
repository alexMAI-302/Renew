Ext.define('app.controller.AutoTransportTabs.Income', {
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
		'AutoTransport.GoodsModel'
	],
	
	views: [
		'AutoTransport.Container',
		'AutoTransport.Income.Container'
	],
	
	incomeContainer: null,
	
	detailStore: null,
	masterStore: null,
	ggroupStore: null,
	goodsStore: null,
	incTypeStore: null,
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
		
		controller.incomeContainer=Ext.create('app.view.AutoTransport.Income.Container');
		controller.incomeContainer.addListener(
			"show",
			function(){
				controller.loadDictionaries();
			}
		);
		
		Ext.getCmp('AutoTransportMain').add(controller.incomeContainer);
		
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
			'#IncomeTable': {
				selectionchange: function(sm, selected, eOpts){
					if(selected!=null && selected.length>0){
						controller.loadDetail(
							getId(selected[0]),
							Ext.getCmp('IncGoodsTable')
						);
						Ext.getCmp('deleteIncome').setDisabled(false);
					} else {
						controller.detailStore.removeAll();
						Ext.getCmp('IncGoodsTable').setDisabled(true);
						Ext.getCmp('deleteIncome').setDisabled(true);
					}
					return true;
				}
			},
			'#IncGoodsTable': {
				selectionchange: function(sm, selected, eOpts){
					Ext.getCmp('deleteIncGoods').setDisabled(selected==null || selected.length==0);
					return true;
				}
			},
			'#addIncGoods':{
				click: function(){
					var sm=Ext.getCmp('IncomeTable').getSelectionModel(),
						r = Ext.ModelManager.create({master_id: sm.getSelection()[0].getId()}, 'app.model.AutoTransport.GoodsModel');
					controller.detailStore.insert(0, r);
				}
			},
			'#saveIncome': {
				click: function(){
					var selected=Ext.getCmp('IncomeTable').getSelectionModel().getSelection()[0];
					if(selected != null){
						selected.set('sum', controller.detailStore.sum('sum'));
					}
					controller.syncMaster(
						controller.incomeContainer,
						getId(selected));
					return true;
				}
			},
			'#addIncome':{
				click: function(){
					var sm=Ext.getCmp('IncomeTable').getSelectionModel(),
						r = Ext.ModelManager.create({ddate: new Date()}, 'app.model.AutoTransport.IncomeModel');
					controller.masterStore.insert(0, r);
					sm.select(r);
				}
			},
			'#deleteIncome': {
				click: function(button){
					var sm = Ext.getCmp('IncomeTable').getSelectionModel();
					
					controller.masterStore.remove(sm.getSelection()[0]);
					if (controller.masterStore.getCount() > 0) {
						sm.select(0);
					}
				}
			},
			'#refreshIncGoods': {
				click: function(){
					var selected=Ext.getCmp('IncomeTable').getSelectionModel().getSelection();
					if(selected!=null && selected.length>0){
						controller.loadDetail(
							getId(selected[0]),
							Ext.getCmp('IncGoodsTable')
						);
					}
				}
			},
			'#deleteIncGoods': {
				click: function(button){
					var sm = Ext.getCmp('IncGoodsTable').getSelectionModel();
					
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
		controller.sellersStore.load();
	},
	
	initStores: function(){
		var controller=this,
			incomeTable = Ext.getCmp('IncomeTable'),
			incGoodsTable = Ext.getCmp('IncGoodsTable');
		
		controller.masterStore=incomeTable.store;
		controller.incTypeStore=incomeTable.columns[1].store;
		controller.sellersStore=incomeTable.columns[2].store;
		
		controller.detailStore=incGoodsTable.store;
		controller.ggroupStore=incGoodsTable.columns[0].store;
		controller.goodsStore=incGoodsTable.columns[1].store;
		controller.measureStore=incGoodsTable.columns[3].store;
		
		controller.loadDictionaries();
	},
	
	initTables: function(){
		var controller=this,
			incGoodsTable = Ext.getCmp('IncGoodsTable'),
			groupColumn = incGoodsTable.columns[0],
			goodsColumn = incGoodsTable.columns[1];
		
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
		
		controller.initTables();
	}
});