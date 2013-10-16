Ext.define('app.controller.DelordDelMisc', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'DelordDelMisc.ResponsibilityAreas',
		'DelordDelMisc.DelordDelMisc'
	],
	
	models: [
		'valueModel',
		'DelordDelMisc.UserModel'
	],
	
	views: [
		'DelordDelMisc.Container'
	],
	
	mainContainer: null,
	
	ResponsibilityAreasStore: null,
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
		
		controller.mainContainer=Ext.create('app.view.DelordDelMisc.Container');
		
		controller.control({
		
     		'#refreshDelordDelMisc': {
				click: function(){
					controller.masterStore.load();
				}
			},
			'#saveDelordDelMisc': {
				click: function(){
					var selected=Ext.getCmp('DelordDelMiscTable').getSelectionModel().getSelection()[0];
					controller.syncMaster(
						controller.mainContainer,
						(selected!=null)?selected.get('id'):null);
					return true;
				}
			},
			'#addDelordDelMisc': {
				click: function(){
						controller.masterStore.insert(0, {});
				}
			}
		});
	},
	
	
	
		loadDictionaries: function(){
		var controller=this;
		
		controller.ResponsibilityAreasStore.load(
			function(records, operation, success){
				if(success===true){
					controller.masterStore.load(
						function(records, operation, success){
							if(success!==true){
								Ext.Msg.alert('Ошибка', "Ошибка при загрузке комментариев к недовезенным заказам");
							}
						}
					);
				} else {
					Ext.Msg.alert('Ошибка', "Ошибка при загрузке списка зон ответственности");
				}
			}
		);
	},
	
	initStores: function(){
		var controller=this,
		DelordDelMiscTable = Ext.getCmp('DelordDelMiscTable');
		controller.masterStore = DelordDelMiscTable.getStore();
		controller.ResponsibilityAreasStore = DelordDelMiscTable.columns[1].store;
		controller.loadDictionaries();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});