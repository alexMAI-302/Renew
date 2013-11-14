Ext.define('app.controller.EmpDutyroster', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'EmpDutyroster.Person',
		'EmpDutyroster.EmpDutytype',
		'EmpDutyroster.EmpDutyroster'
	],
	
	models: [
		'valueModel',
		'EmpDutyroster.UserModel'
	],
	
	views: [
		'EmpDutyroster.Container'
	],
	
	mainContainer: null,
	PersonStore: null,
	masterStore: null,
	EmpDutytypeStore: null,
	
	
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
		
		controller.mainContainer=Ext.create('app.view.EmpDutyroster.Container');
		
		controller.control({
			'#filterEmpDutyroster': {
				click: function(button) {
				         controller.masterStore.proxy.extraParams=
						 {
						ddatebf: Ext.getCmp('ddatebEmpDutyroster').getValue(),
						ddateef: Ext.getCmp('ddateeEmpDutyroster').getValue(),
					    dutytypef : Ext.getCmp('dutytypeComboEmpDutyroster').getValue()
						
						};
					controller.masterStore.load();
				}
			},
     		'#addEmpDutyroster': {
				click: function(){
						controller.masterStore.insert(0, {});
				}
			},

			'#saveEmpDutyroster': {
				click: function(){
					var selected=Ext.getCmp('EmpDutyrosterTable').getSelectionModel().getSelection()[0];
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
		
		
		controller.EmpDutytypeStore.load();
		controller.PersonStore.load(
			function(records, operation, success){
				if(success===true){

					controller.masterStore.proxy.extraParams=
						 {
						ddatebf: Ext.getCmp('ddatebEmpDutyroster').getValue(),
						ddateef: Ext.getCmp('ddateeEmpDutyroster').getValue(),
						dutytypef : Ext.getCmp('dutytypeComboEmpDutyroster').getValue()
						};
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
		EmpDutyrosterTable = Ext.getCmp('EmpDutyrosterTable');

		
		controller.masterStore = EmpDutyrosterTable.getStore();
		controller.PersonStore = EmpDutyrosterTable.columns[0].store;
		controller.EmpDutytypeStore=EmpDutyrosterTable.columns[3].store;
		controller.loadDictionaries();
	},
	bindStores: function(){
		var controller=this;
		Ext.getCmp('dutytypeComboEmpDutyroster').bindStore(controller.EmpDutytypeStore);
		Ext.getCmp('dutytypeComboEmpDutyroster').value=1
	},
	
	onLaunch: function(){
		var controller = this;
		controller.initStores();
		controller.bindStores();
	}
});