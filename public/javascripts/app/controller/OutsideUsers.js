Ext.define('app.controller.OutsideUsers', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'OutsideUsers.RenewUsers',
		'OutsideUsers.OutsideUsers'
	],
	
	models: [
		'valueModel',
		'OutsideUsers.UserModel'
	],
	
	views: [
		'OutsideUsers.Container'
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
		
		controller.mainContainer=Ext.create('app.view.OutsideUsers.Container');
		
		controller.control({
			'#filterOutsideUsers': {
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
		var controller=this;
		
		controller.masterStore = controller.getOutsideUsersOutsideUsersStore();
		controller.renewUsersStore = controller.getOutsideUsersRenewUsersStore();
		
		controller.loadDictionaries();
	},
	
	bindStores: function(){
		var controller=this,
			outsideUsersTable=Ext.getCmp('OutsideUsersTable');
		
		outsideUsersTable.reconfigure(controller.masterStore);
	},
	
	makeComboColumn: function(column, storeCombo, tableStore, property, allowNull, onlyRenderer){
		function renderer(value){
			var matching = null,
				data=storeCombo.snapshot || storeCombo.data;
			data.each(function(record){
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
			outsideUsersTable = Ext.getCmp('OutsideUsersTable'),
			userColumn=outsideUsersTable.columns[0];
		
		controller.makeComboColumn(userColumn, controller.renewUsersStore, controller.masterStore, 'renew_user_id');
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
		
		controller.initTables();
	}
});