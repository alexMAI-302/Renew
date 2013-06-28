Ext.define('app.controller.KeyValueDictionary', {
    extend: 'Ext.app.Controller',
	stores: [
		'keyValueDictionary.DictionaryEntries'
	],
	
	models: [
		'valueModel'
	],
	
	views: [
		'keyValueDictionary.Container'
	],
	
	mainContainer: null,
	masterStore: null,
	
	load: function(){
		var controller=this;
		
		controller.masterStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке словаря");
				}
				controller.mainContainer.setLoading(false);
			}
		);
	},
	
	sync: function(masterStore, container){
		if (
			(masterStore.getNewRecords().length > 0) ||
			(masterStore.getUpdatedRecords().length > 0) ||
			(masterStore.getRemovedRecords().length > 0)){
				
			container.setLoading(true);
			masterStore.sync({
				callback: function(batch){
					if(batch.exceptions.length>0){
						Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
					}
					container.setLoading(false);
				}
			});
		}
	},
	
	init: function() {
		var controller = this,
			itemsToControl={};
		
		controller.mainContainer=Ext.create('app.view.keyValueDictionary.Container');
		
		itemsToControl['#saveDictionary'] = {
			click: function(){
				controller.sync(
					controller.masterStore,
					controller.mainContainer);
				return true;
			}
		};
		
		itemsToControl['#DictionaryTable'] = {
			selectionchange: function(sm, selected, eOpts){
				Ext.getCmp('deleteDictionary').setDisabled(selected==null || selected.length==0);
				return true;
			}
		};
		
		itemsToControl['#addDictionary'] = {
			click: function(){
				controller.masterStore.insert(0, {});
			}
		};
		
		itemsToControl['#refreshDictionary'] = {
			click: controller.load
		};
		
		itemsToControl['#deleteDictionary'] = {
			click: function(button){
				var sm = Ext.getCmp('DictionaryTable').getSelectionModel();
				
				controller.masterStore.remove(sm.getSelection()[0]);
				if (controller.masterStore.getCount() > 0) {
					sm.select(0);
				}
			}
		};
		
		controller.control(itemsToControl);
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore=controller.getKeyValueDictionaryDictionaryEntriesStore();
		controller.load();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});