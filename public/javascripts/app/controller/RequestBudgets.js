Ext.define('app.controller.RequestBudgets', {
    extend: 'Ext.app.Controller',
	
	stores: [
	    'RequestBudgets.Person',
		'RequestBudgets.Partners',
		'RequestBudgets.CurrentPerson',
		'RequestBudgets.RequestBudgets',
		'app.store.RequestBudgets.channel_NRC',
		'app.store.RequestBudgets.tmside',
		'RequestBudgets.Dept',
		'RequestBudgets.CatManager'
	],
	
	models: [
		'valueModel',
		'RequestBudgets.UserModel'
	],
	
	views: [
		'RequestBudgets.Container'
	],
	
	mainContainer: null,
	PersonStore: null,
	PartnersStore: null,
	masterStore: null,
	myStore: null,
	channel_NRCStore:null,
	filterRequestBudgetsPerson:null,
	filterRequestBudgetsDept:null,
	filterRequestBudgetsCatManager:null,
	
	
	storeHasChanges: function(store){
		return (store.getNewRecords().length > 0) ||
			(store.getUpdatedRecords().length > 0) ||
			(store.getRemovedRecords().length > 0)
	},
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	syncMaster: function(container, selectedMasterId){
		var controller=this;
		
		if (controller.storeHasChanges(controller.masterStore)){
				
			container.setLoading(true);
			controller.masterStore.sync({
				callback: function(batch){
					if(batch.exceptions.length>0){
						Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
						container.setLoading(false);
					}
					container.setLoading(false);
				}
			});
		}
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.RequestBudgets.Container');
		
		controller.control({
		
     		'#refreshRequestBudgets': {
				click: function(){
				controller.masterStore.proxy.extraParams={
					personf: Ext.getCmp('filterRequestBudgetsPerson').getValue(),
					deptf: Ext.getCmp('filterRequestBudgetsDept').getValue(),
					cmf: Ext.getCmp('filterRequestBudgetsCatManager').getValue() 
					
					
				};	
				
			
					
		
					controller.masterStore.load();
				}
			},
			'#saveRequestBudgets': {
				click: function(){
					var selected=Ext.getCmp('RequestBudgetsTable').getSelectionModel().getSelection()[0];
					controller.syncMaster(
						controller.mainContainer,
						(selected!=null)?selected.get('id'):null);
					return true;
				}
			},
			'#addRequestBudgets': {
				click: function(){
					var sm=Ext.getCmp('RequestBudgetsTable').getSelectionModel();
					var id = null;
					if (controller.myStore.count() > 0 ) 
					{
						id = controller.myStore.first().get ('id');
					};
					var r = Ext.ModelManager.create({ddate: new Date(), person: id }, 'app.model.RequestBudgets.UserModel');
					controller.masterStore.insert(0, r);
					sm.select(r);
				}
			}
		});
	},
	
	loadDictionaries: function(){
		var controller=this;
		
		controller.myStore = Ext.create('Ext.data.Store', {
				model: 'app.model.valueModel',
				autoLoad: true,
				proxy: {
					type: 'rest',
					url : '/request_budgets/get_current_person',
					reader: {
						type: 'json'
					}
				}
			});
		
		
		controller.PersonStore.load(
		function(records, operation, success){
		if(success===true){controller.filterRequestBudgetsPerson.add (controller.PersonStore.getRange(0, controller.PersonStore.getCount() - 1))}});
		
		controller.channel_NRCStore.load();
		controller.filterRequestBudgetsDept.load();
		controller.filterRequestBudgetsCatManager.load();
		
		controller.tmsideStore.load();
		
		controller.mainContainer.setLoading (true);
		
		controller.PartnersStore.load(
			function(records, operation, success){
				if(success===true){
						controller.masterStore.load(
						function(records, operation, success){
							if(success!==true){
								Ext.Msg.alert('Ошибка', "Ошибка при загрузке заявок");
								controller.mainContainer.setLoading(false);
							}
						}
					);
					controller.mainContainer.setLoading(false);
				} else {
					Ext.Msg.alert('Ошибка', "Ошибка при загрузке списка пользователей");
					controller.mainContainer.setLoading(false);
				}
			}
		)
		
		},
	
	
	initStores: function(){
		var controller=this,
		RequestBudgetsTable = Ext.getCmp('RequestBudgetsTable');
		controller.masterStore = RequestBudgetsTable.getStore();
		controller.PersonStore = RequestBudgetsTable.columns[1].store;
		controller.PartnersStore = RequestBudgetsTable.columns[3].store;
		controller.channel_NRCStore = RequestBudgetsTable.columns[4].store;
		controller.tmsideStore = RequestBudgetsTable.columns[5].store;
		controller.filterRequestBudgetsPerson = Ext.getCmp('filterRequestBudgetsPerson').getStore();
		controller.filterRequestBudgetsDept = Ext.getCmp('filterRequestBudgetsDept').getStore();
		controller.filterRequestBudgetsCatManager = Ext.getCmp('filterRequestBudgetsCatManager').getStore();
		controller.loadDictionaries();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});