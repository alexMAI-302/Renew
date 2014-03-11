Ext.define('app.controller.PricesForComparison', {
	extend : 'Ext.app.Controller',

	stores : ['PricesForComparison.PricesForComparison', 'PricesForComparison.Pricelist', 'PricesForComparison.Lggroup','PricesForComparison.Catmanager'],

	models : ['valueModel', 'PricesForComparison.PricesForComparisonModel'],

	views : ['PricesForComparison.Container'],

	mainContainer : null,

	masterStore : null,
	PricelistStore : null,
	PricelistStore2 : null,
	PricelistStore3 : null,
	PricelistStore4 : null,
	PricelistStore5 : null,
	PricelistStore6 : null,
	PricelistStore7 : null,
	PricelistStore8 : null,
	PricelistStore9 : null,
	PricelistStore10 : null,
	LggroupStore : null,
	filterPricesForComparisonKM : null,

	storeHasChanges : function(store) {
		return (store.getNewRecords().length > 0) || (store.getUpdatedRecords().length > 0) || (store.getRemovedRecords().length > 0)
	},

	showServerError : function(response, options) {
		var controller = this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},

	syncMaster : function(container, selectedMasterId) {
		var controller = this;

		if (controller.storeHasChanges(controller.masterStore)) {

			container.setLoading(true);
			controller.masterStore.sync({
				callback : function(batch) {
					if (batch.exceptions.length > 0) {
						Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
						container.setLoading(false);
					}
					container.setLoading(false);
				}
			});
		}
	},

	init : function() {
		var controller = this;

		controller.mainContainer = Ext.create('app.view.PricesForComparison.Container');

		controller.control({

			'#refreshPricesForComparison' : {
				click : function() {
					controller.masterStore.proxy.extraParams={
					cmf: Ext.getCmp('filterPricesForComparisonKM').getValue() 
					
					
				};	

					controller.masterStore.load();
				}
			},
			'#addPricesForComparison' : {
				click : function() {
					controller.masterStore.insert(0, {});
				}
			},
			'#savePricesForComparison' : {
				click : function() {
					var selected = Ext.getCmp('PricesForComparisonTable').getSelectionModel().getSelection()[0];
					controller.syncMaster(controller.mainContainer, (selected != null) ? selected.get('id') : null);
					return true;
				}
			}
		});
	},

	loadDictionaries : function() {
		var controller = this;
		controller.mainContainer.setLoading(true);
		controller.filterPricesForComparisonKM.load();

		controller.PricelistStore.load(function(records, operation, success) {
			if (success === true) {
				controller.mainContainer.setLoading(true);

				controller.PricelistStore2.add(controller.PricelistStore.getRange(0, controller.PricelistStore.getCount() - 1, {
					callback : function() {
						controller.PricelistStore3.add(controller.PricelistStore.getRange(0, controller.PricelistStore.getCount() - 1, {
							callback : function() {
								controller.PricelistStore4.add(controller.PricelistStore.getRange(0, controller.PricelistStore.getCount() - 1, {
									callback : function() {
										controller.PricelistStore5.add(controller.PricelistStore.getRange(0, controller.PricelistStore.getCount() - 1, {
											callback : function() {
												controller.PricelistStore6.add(controller.PricelistStore.getRange(0, controller.PricelistStore.getCount() - 1, {
													callback : function() {
														controller.PricelistStore7.add(controller.PricelistStore.getRange(0, controller.PricelistStore.getCount() - 1, {
															callback : function() {
																controller.PricelistStore8.add(controller.PricelistStore.getRange(0, controller.PricelistStore.getCount() - 1, {
																	callback : function() {
																		controller.PricelistStore9.add(controller.PricelistStore.getRange(0, controller.PricelistStore.getCount() - 1, {
																			callback : function() {
																				controller.PricelistStore10.add(controller.PricelistStore.getRange(0, controller.PricelistStore.getCount() - 1, {
																					callback : function() {

																						controller.LggroupStore.load(function(records, operation, success) {
																							if (success === true) {

																								controller.masterStore.load(function(records, operation, success) {
																									if (success === true) {
																										controller.mainContainer.setLoading(false);
																									} else {
																										Ext.Msg.alert('Ошибка', "Ошибка при загрузке окна");
																										controller.mainContainer.setLoading(false);
																									}
																								})
																							} else {
																								Ext.Msg.alert('Ошибка', "Ошибка при загрузке групп товаров");
																								controller.mainContainer.setLoading(false);
																							}
																						})
																					}
																				}))
																			}
																		}))
																	}
																}))
															}
														}))
													}
												}))
											}
										}))
									}
								}))
							}
						}))
					}
				}))
			} else {
				Ext.Msg.alert('Ошибка', "Ошибка при загрузке прайс - листов");
				controller.mainContainer.setLoading(false);
			}
		});
		controller.mainContainer.setLoading(false);

	},

	initStores : function() {
		var controller = this, PricesForComparisonTable = Ext.getCmp('PricesForComparisonTable');
		controller.masterStore = PricesForComparisonTable.getStore();
		controller.LggroupStore = PricesForComparisonTable.columns[0].store;
		controller.PricelistStore = PricesForComparisonTable.columns[1].store;
		controller.PricelistStore2 = PricesForComparisonTable.columns[2].store;
		controller.PricelistStore3 = PricesForComparisonTable.columns[3].store;
		controller.PricelistStore4 = PricesForComparisonTable.columns[4].store;
		controller.PricelistStore5 = PricesForComparisonTable.columns[5].store;
		controller.PricelistStore6 = PricesForComparisonTable.columns[6].store;
		controller.PricelistStore7 = PricesForComparisonTable.columns[7].store;
		controller.PricelistStore8 = PricesForComparisonTable.columns[8].store;
		controller.PricelistStore9 = PricesForComparisonTable.columns[9].store;
		controller.PricelistStore10 = PricesForComparisonTable.columns[10].store;
		controller.filterPricesForComparisonKM = Ext.getCmp('filterPricesForComparisonKM').getStore();
		controller.loadDictionaries();

	},

	onLaunch : function() {
		var controller = this;

		controller.initStores();
	}
});
