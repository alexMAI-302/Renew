Ext.define('app.controller.TerminalKey', {
	extend : 'Ext.app.Controller',

	stores : ['TerminalKey.TerminalKeyLogData', 'TerminalKey.TerminalKeyData', 'TerminalKey.PpsZoneData', 'TerminalKey.KeyTypeData'],

	models : ['TerminalKey.TerminalKeyLogModel', 'TerminalKey.TerminalKeyModel', 'valueModel'],

	views : ['TerminalKey.Container', 'TerminalKey.Filter'],

	mainContainer : null,
	KeyTypeStore : null,
	PpsZoneStore : null,
	masterStore : null,
	slaveStore : null,
	ppsZoneColumn : null,
	keyTypeColumn : null,

	loadDetail : function(store, masterId, errorString) {
		var controller = this;

		store.proxy.extraParams = {
			master_id : masterId
		};
		store.load(function(records, operation, success) {
			if (success !== true) {
				Ext.Msg.alert("Ошибка", errorString);
			}
		});

	},

	filterTerminalKey : function(combo, records, eOpts) {
		var controller = this;

		controller.masterStore.proxy.extraParams = {
			filter_str : Ext.getCmp('nameTextfield').getValue()
		};
		controller.masterStore.load(function(records, operation, success) {
			if (!success) {
				Ext.Msg.alert("Ошибка", "Ошибка при получении данных");
			}
			return true;
		});
	},
	init : function() {
		var controller = this;

		controller.mainContainer = Ext.create('app.view.TerminalKey.Container');

		controller.control({
			'#filterTerminalKey' : {
				click : controller.filterTerminalKey
			},
			'#addTerminalKey' : {
				click : function() {

					controller.masterStore.insert(0, {});
				}
			},
			'#saveTerminalKey' : {
				click : function() {
					controller.masterStore.sync({
						callback : function(batch, response) {
							if (batch.exceptions.length > 0) {
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							}
							else{
								var data = eval('('+response.responseText+')');
								controller.loadDetail(
									controller.slaveStore,
									Ext.getCmp('TerminalKeyTable').getSelectionModel().getSelection()[0].get('id'),
									"Ошибка получения данных журнала"
								);
								
							}
						}
						
					});
					return true;
				}
			},
			'#TerminalKeyTable' : {
				selectionchange: function(sm, selected, eOpts){
					
						controller.loadDetail(
							controller.slaveStore,
							selected[0].get('id'),
							"Ошибка получения данных журнала"
						);
					
				}
			}
		});

	},
	loadDictionaries : function() {
		var controller = this, count = 2;

		controller.mainContainer.setLoading(true);
		function checkLoading(val) {
			if (val == 0) {
				controller.mainContainer.setLoading(false);
				controller.filterTerminalKey();
			}
		};

		controller.KeyTypeStore.load(function(success) {
			count--;
			checkLoading(count);
		});
		controller.PpsZoneStore.load(function(success) {
			count--;
			checkLoading(count);
		});

		controller.mainContainer.setLoading(false);

	},
	initStores : function() {
		var controller = this, TerminalKeyTable = Ext.getCmp('TerminalKeyTable'), TerminalKeyLogTable = Ext.getCmp('TerminalKeyLogTable');

		controller.masterStore = controller.getTerminalKeyTerminalKeyDataStore();
		controller.slaveStore = controller.getTerminalKeyTerminalKeyLogDataStore();
		controller.KeyTypeStore = TerminalKeyTable.columns[3].store;
		controller.PpsZoneStore = TerminalKeyTable.columns[4].store;
		controller.loadDictionaries();
	},
	bindStores : function() {
		var 
			controller = this, 
			TerminalKeyTable = Ext.getCmp('TerminalKeyTable'),
			TerminalKeyLogTable = Ext.getCmp('TerminalKeyLogTable');

		TerminalKeyTable.reconfigure(controller.masterStore);
		TerminalKeyLogTable.reconfigure(controller.slaveStore);
	},
	onLaunch : function() {
		var controller = this;

		controller.initStores();
		controller.bindStores();
		
		keyTypeColumn = Ext.getCmp('TerminalKeyTable').columns[3];
		ppsZoneColumn = Ext.getCmp('TerminalKeyTable').columns[4];
		
		ppsZoneColumn.field.addListener(
			"expand",
			function(field, eOpts){
				var r = Ext.getCmp('TerminalKeyTable').getSelectionModel().getSelection()[0];
				controller.PpsZoneStore.clearFilter();
				controller.PpsZoneStore.filter([{property:"spv_id", value: r.get('spv_id')}]);
				return true;
			}
		);
		
		keyTypeColumn.addListener(
			"select",
			function(field, value, options){
				var r = Ext.getCmp('TerminalKeyTable').getSelectionModel().getSelection()[0];
				r.beginEdit();
				r.set("zoneid",null);
				r.endEdit(true);
				//ppsZoneColumn.setValue(null);
			}
		);
	}
});
