Ext.define('app.controller.IncrequestReason', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'IncrequestReason.ResponsibilityAreas',
		'IncrequestReason.IncrequestReason'
	],
	
	models: [
		'valueModel',
		'IncrequestReason.UserModel'
	],
	
	views: [
		'IncrequestReason.Container'
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
		
		controller.mainContainer=Ext.create('app.view.IncrequestReason.Container');
		
		controller.control({
		
     		'#refreshIncrequestReason': {
				click: function(){
					controller.masterStore.load();
				}
			},
			'#saveIncrequestReason': {
				click: function(){
					var selected=Ext.getCmp('IncrequestReasonTable').getSelectionModel().getSelection()[0];
					controller.syncMaster(
						controller.mainContainer,
						(selected!=null)?selected.get('id'):null);
					return true;
				}
			},
			'#addIncrequestReason': {
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
								Ext.Msg.alert('Ошибка', "Ошибка при загрузке причин невыполнения заявок на инкассацию ");
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
		IncrequestReasonTable = Ext.getCmp('IncrequestReasonTable');
		controller.masterStore = IncrequestReasonTable.getStore();
		controller.ResponsibilityAreasStore = IncrequestReasonTable.columns[1].store;
		controller.loadDictionaries();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});