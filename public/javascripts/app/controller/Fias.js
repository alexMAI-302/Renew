Ext.define('app.controller.Fias', {
	extend : 'Ext.app.Controller',

	stores : ['Fias.FiasData'],

	models : ['Fias.FiasModel'],

	views : ['Fias.Container'],

	mainContainer : null,
	
	fiasStore : null,

	/*filterSubdealerRemains : function(combo, records, eOpts) {
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
	},*/
	init : function() {
		var controller = this;

		controller.mainContainer = Ext.create('app.view.Fias.Container');

		/*controller.control({
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
		});*/
		Ext.getCmp('fiasCombo').on("change", function(combo, newValue, oldValue, eOpts) {

			controller.fiasStore.proxy.extraParams = {
				search_str : newValue
			};
			if (newValue === null )
			{
				Ext.getCmp('houseguidTextfield').setValue('');
			}
			//console.log( controller.fiasStore.proxy.extraParams);
			//combo.clearValue( );
			/*controller.mainContainer.setLoading(true);
			controller.fiasStore.load(function(success) {
			controller.mainContainer.setLoading(false);
			});*/
			
			//console.log('oldValue: ' + oldValue);
			//console.log('newValue: ' + newValue);
			
		});

		Ext.getCmp('fiasCombo').on("select", function( combo, records, eOpts) {

			Ext.getCmp('houseguidTextfield').setValue(records[0].get('id'));


			//console.log( controller.fiasStore.proxy.extraParams);
			//combo.clearValue( );
			/*controller.mainContainer.setLoading(true);
			controller.fiasStore.load(function(success) {
			controller.mainContainer.setLoading(false);
			});*/
			
			//console.log('oldValue: ' + oldValue);
			//console.log('newValue: ' + newValue);
		});

	},

	loadDictionaries : function() {
		var controller = this, count = 1;

		controller.mainContainer.setLoading(true);
		function checkLoading(val) {
			if (val == 0) {
				controller.mainContainer.setLoading(false);
			}
		};
		
		controller.fiasStore.load(function(success) {
			count--;
			checkLoading(count);
		});


	},

	initStores : function() {
		var controller = this;
		controller.fiasStore = controller.getFiasFiasDataStore();

		/*controller.masterStore = controller.getSubdealerRemainsSubdealerRemainsDataStore();*/
		controller.loadDictionaries();
	},

	bindStores : function() {
		var controller = this//, SubdealerRemainsTable = Ext.getCmp('SubdealerRemainsTable');
		//SubdealerRemainsTable.reconfigure(controller.masterStore);
		Ext.getCmp('fiasCombo').bindStore(controller.fiasStore);


	},

	onLaunch : function() {
		var controller = this;

		controller.initStores();
		controller.bindStores();
		//controller.filterSubdealerRemains();
	}
}); 