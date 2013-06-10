Ext.define('app.controller.Dictionary', {
    extend: 'Ext.app.Controller',
	stores: [
		'dictionary.DictionaryEntries',
		'dictionary.Properties1',
		'dictionary.Properties2'
	],
	
	models: [
		'valueModel'
	],
	
	views: [
		'dictionary.Container'
	],
	
	mainContainer: null,
	masterStore: null,
	
	load: function(){
		var controller=this,
			property1Name = Ext.get('property1_name').getValue(),
			property2Name = Ext.get('property2_name').getValue();
		
		controller.masterStore.proxy.extraParams = {
			property1_name: property1Name,
			property2_name: property2Name
		};
		controller.masterStore.proxy.extraParams[property1Name] = Ext.getCmp('DictionaryFilter'+property1Name).getValue();
		controller.masterStore.proxy.extraParams[property2Name] = Ext.getCmp('DictionaryFilter'+property2Name).getValue();
		
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
			masterStore.proxy.extraParams = {
				property1_name: Ext.get('property1_name').getValue(),
				property2_name: Ext.get('property2_name').getValue()
			};
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
		
		controller.mainContainer=Ext.create('app.view.dictionary.Container');
		
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
				var r = Ext.ModelManager.create({}, 'app.model.dictionary.DictionaryModel');
				controller.masterStore.add(r);
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
		
		controller.masterStore=controller.getDictionaryDictionaryEntriesStore();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});