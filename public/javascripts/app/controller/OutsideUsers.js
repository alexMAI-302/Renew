Ext.define('app.controller.OutsideUsers', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'outsideUsers.RenewUsers',
		'outsideUsers.OutsideUsers'
	],
	
	models: [
		'valueModel',
		'outsideUsers.UserModel'
	],
	
	views: [
		'outsideUsers.Container'
	],
	
	mainContainer: null,
	
	renewUsersStore: null,
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
		
		controller.mainContainer=Ext.create('app.view.outsideUsers.Container');
		
		controller.control({
			'#refreshOutsideUsers': {
				click: function(){
					controller.masterStore.load();
				}
			},
			'#saveOutsideUsers': {
				click: function(){
					var selected=Ext.getCmp('OutsideUsersTable').getSelectionModel().getSelection()[0];
					controller.syncMaster(
						controller.mainContainer,
						(selected!=null)?selected.get('id'):null);
					return true;
				}
			}
		});
	},
	
	loadDictionaries: function(){
		var controller=this;
		
		controller.renewUsersStore.load(
			function(records, operation, success){
				if(success===true){
					controller.masterStore.load(
						function(records, operation, success){
							if(success!==true){
								Ext.Msg.alert('Ошибка', "Ошибка при загрузке пользователей");
							}
						}
					);
				} else {
					Ext.Msg.alert('Ошибка', "Ошибка при загрузке списка пользователей renew");
				}
			}
		);
	},
	
	initStores: function(){
		var controller=this,
			outsideUsersTable = Ext.getCmp('OutsideUsersTable');
		
		controller.masterStore = outsideUsersTable.getStore();
		controller.renewUsersStore = outsideUsersTable.columns[0].store;
		
		controller.loadDictionaries();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});