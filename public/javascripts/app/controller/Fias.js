Ext.define('app.controller.Fias', {
	extend : 'Ext.app.Controller',

	stores : ['Fias.FiasData', 'Fias.FiasDetailData', 'Fias.PartnersGroupsData', 'Fias.PlaceunloadData'],

	models : ['valueStrModel', 'Fias.FiasDetailModel', 'valueModel'],

	views : ['Fias.Container'],

	mainContainer : null,

	fiasStore : null,
	fiasdetailStore : null,
	tpStore : null,

	init : function() {
		var controller = this;

		controller.mainContainer = Ext.create('app.view.Fias.Container');

		controller.control({
			'#saveFias' : {
				click : function(btn, e, eOpts) {
					var aoguid;
					aoguid = controller.fiasdetailStore.getAt(controller.fiasdetailStore.count() - 1).get('aoguid');
					Ext.getCmp('PlaceunloadGridTable').getSelectionModel().getSelection()[0].set('aoguid', aoguid);
				}
			},
			'#PlaceunloadGridTable' : {
				selectionchange : function(pu, selected, eOpts) {
					if (pu.getCount() > 0) {
						if (selected[0].get('aoguid') == 0 && selected[0].get('address') != 0) {
							//Ext.getCmp('fiasCombo').setValue(selected[0].get('address'), true);
							controller.fiasStore.proxy.extraParams = {
								search_str : selected[0].get('address')
							};
						} else {
							controller.fiasStore.proxy.extraParams = {
								aoguid : selected[0].get('aoguid')
							};
						};
						controller.mainContainer.setLoading(true);
						controller.fiasStore.load(function(success) {
							//alert(Ext.getCmp('fiasCombo').getStore().getAt(1).get('name'));
							Ext.getCmp('fiasCombo').select(controller.fiasStore.getAt(0).get('name'));

							controller.fiasdetailStore.proxy.extraParams = {
								aoguid : controller.fiasStore.getAt(0).get('id')
							};
							controller.fiasdetailStore.load(function(records, operation, success) {
								controller.mainContainer.setLoading(false);
								return true;
							});
							return true;

						});
						if (Ext.getCmp('FiasDetailTable').getSelectionModel().getCount() > 0) {
							Ext.getCmp('saveFias').enable();
						} else {
							Ext.getCmp('saveFias').disable();
						};
					} else {
						Ext.getCmp('saveFias').disable();
					}
				}
			},
			'#savePlaceunloadGrid' : {
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
		Ext.getCmp('fiasCombo').on("change", function(combo, newValue, oldValue, eOpts) {

			controller.fiasStore.proxy.extraParams = {
				search_str : newValue
			};

		});
		Ext.getCmp('partnersgroupsCombo').on("change", function(combo, newValue, oldValue, eOpts) {

			controller.tpStore.proxy.extraParams = {
				pg_search_str : newValue
			};
//			controller.tpStore.Load();

		});
		
		Ext.getCmp('partnersgroupsCombo').on("select", function(combo, records, eOpts) {

			controller.tpStore.proxy.extraParams = {
				pg_search_str : records[0].get('name')
			};

		});
		

		Ext.getCmp('fiasCombo').on("select", function(combo, records, eOpts) {

			controller.fiasdetailStore.proxy.extraParams = {
				aoguid : records[0].get('id')
			};
			controller.fiasdetailStore.load(function(records, operation, success) {
				if (!success) {
					Ext.Msg.alert("Ошибка", "Ошибка при получении данных");
				}
				return true;
			});

		});

		Ext.getCmp('partnersgroupsCombo').on("select", function(combo, records, eOpts) {
			controller.masterStore.proxy.extraParams = {
				pg : records[0].get('id')
			};
			controller.mainContainer.setLoading(true);
			controller.masterStore.load(function(records, operation, success) {
				if (!success) {
					Ext.Msg.alert("Ошибка", "Ошибка при получении данных");
				}
				controller.mainContainer.setLoading(false);
				return true;
			});
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

		controller.tpStore.load(function(success) {
			count--;
			checkLoading(count);
		});

		controller.fiasStore.load(function(success) {
			count--;
			checkLoading(count);
		});

	},

	initStores : function() {
		var controller = this;
		controller.fiasStore = controller.getFiasFiasDataStore();
		controller.fiasdetailStore = controller.getFiasFiasDetailDataStore();
		controller.tpStore = controller.getFiasPartnersGroupsDataStore();
		controller.masterStore = controller.getFiasPlaceunloadDataStore();
		controller.loadDictionaries();

		controller.fiasdetailStore.on("load", function(fd, records, successful, eOpts) {
			if (Ext.getCmp('PlaceunloadGridTable').getSelectionModel().getCount() > 0) {
				Ext.getCmp('saveFias').enable();
			} else {
				Ext.getCmp('saveFias').disable();
			}
		});

	},

	bindStores : function() {
		var controller = this, FiasDetailTable = Ext.getCmp('FiasDetailTable'), PlaceunloadTable = Ext.getCmp('PlaceunloadGridTable');
		PlaceunloadTable.reconfigure(controller.masterStore);
		FiasDetailTable.reconfigure(controller.fiasdetailStore);
		Ext.getCmp('fiasCombo').bindStore(controller.fiasStore);
		Ext.getCmp('partnersgroupsCombo').bindStore(controller.tpStore);
	},

	onLaunch : function() {
		var controller = this;

		controller.initStores();
		controller.bindStores();
	}
});
