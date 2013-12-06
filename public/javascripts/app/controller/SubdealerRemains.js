Ext.define('app.controller.SubdealerRemains', {
	extend : 'Ext.app.Controller',

	stores : ['SubdealerRemains.SubdealerRemainsData'],

	models : ['app.model.SubdealerRemains.SubdealerRemainsModel'],

	views : ['app.view.SubdealerRemains.Container', 'app.view.Lib.DateIntervalFilter'],

	mainContainer : null,

	filterSubdealerRemains : function(combo, records, eOpts) {
		var controller = this;

		controller.masterStore.proxy.extraParams = {
			ddateb : Ext.getCmp('ddatebSubdealerRemains').getValue(),
			ddatee : Ext.getCmp('ddateeSubdealerRemains').getValue()
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

		controller.mainContainer = Ext.create('app.view.SubdealerRemains.Container');

		controller.control({
			'#filterSubdealerRemains' : {
				click : controller.filterSubdealerRemains
			},
			'#saveSubdealerRemains' : {
				click : function() {
					controller.masterStore.sync({
						callback : function(batch) {
							if (batch.exceptions.length > 0) {
								Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
							}
						}
					});
					return true;
				}
			}
		});

	},

	loadDictionaries : function() {
		var controller = this, count = 0;

		/*controller.mainContainer.setLoading(true);
		function checkLoading(val) {
			if (val == 0) {
				controller.mainContainer.setLoading(false);
			}
		};
*/
	},

	initStores : function() {
		var controller = this;

		controller.masterStore = controller.getSubdealerRemainsSubdealerRemainsDataStore();
		controller.loadDictionaries();
	},

	bindStores : function() {
		var controller = this, SubdealerRemainsTable = Ext.getCmp('SubdealerRemainsTable');

		SubdealerRemainsTable.reconfigure(controller.masterStore);
	},

	onLaunch : function() {
		var controller = this;

		controller.initStores();
		controller.bindStores();
		controller.filterSubdealerRemains();
	}
}); 