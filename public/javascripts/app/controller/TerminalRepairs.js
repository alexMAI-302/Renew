Ext.define('app.controller.TerminalRepairs', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'TerminalRepairs.TerminalRepairs'
	],
	
	models: [
		'valueModel',
		'TerminalRepairs.TerminalRepairsModel'
	],
	
	views: [
		'TerminalRepairs.Container'
	],
	
	mainContainer: null,
	
	masterStore: null,
	
	
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
	
	syncMaster: function(container){
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
		
		controller.mainContainer=Ext.create('app.view.TerminalRepairs.Container');
		
		controller.control({
		
     		'#refreshTerminalRepairs': {
				click: function(){
					controller.masterStore.load();
				}
			},
			'#saveTerminalRepairs': {
				click: function(){
					controller.syncMaster(controller.mainContainer);
					return true;
				}
			},
			'#addTerminalRepairs': {
				click: function(){
						controller.masterStore.insert(0, {});
				}
			}
		});
	},
	
	
	
		loadDictionaries: function(){
		var controller=this;
					controller.masterStore.load(
						function(records, operation, success){
							if(success!==true){
								Ext.Msg.alert('Ошибка', "Ошибка при загрузке окна");
							}
						}
					);
		},
				
	
	initStores: function(){
		var controller=this,
		TerminalRepairsTable = Ext.getCmp('TerminalRepairsTable');
		controller.masterStore = TerminalRepairsTable.getStore();
		controller.loadDictionaries();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});
