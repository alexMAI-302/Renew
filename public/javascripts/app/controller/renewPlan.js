Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');
Ext.require([
    'Ext.ux.CheckColumn'
]);
Ext.define('app.controller.RenewPlan', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'RenewPlan.RenewPlans',
		'RenewPlan.RenewPlanTypes',
		'RenewPlan.RenewPlanGoods',
		'RenewPlan.SiteToStorages',
		'RenewPlan.Sites',
		// 'RenewPlan.Lggroups',
		'RenewPlan.Goods',
		// 'RenewPlan.Sellers'
	],
	
	models: [
		'valueModel',
		'RenewPlan.RenewPlanModel',
		'RenewPlan.RenewPlanGoodsModel',
		'RenewPlan.SiteStorageModel'
	],
	
	views: [
		'RenewPlan.Container'
	],
	
	mainContainer: null,
	
	detailStore: null,
	masterStore: null,
	sitesStore: null,
	siteToStoragesStore: null,
	renewPlanTypesStore: null,
	siteToStoragesComboStore: null,
	
	selectedRenewPlan: null,
	
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
	
	syncDetail: function(container, masterId){
		var controller=this;
		
		if (controller.storeHasChanges(detailStore)){
			
			if(masterId!=null){
				controller.detailStore.proxy.extraParams={
					master_id: masterId
				};
				
				controller.detailStore.sync({
					callback: function(batch){
						if(batch.exceptions.length>0){
							Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
						}
						container.setLoading(false);
					}
				});
			} else {
				Ext.Msg.alert("Внимание", "Ваши данные в таблице с детализацией были утеряны. Сначала сохраняйте данные в основной таблице, затем вводите детализацию.");
				container.setLoading(false);
			}
		} else {
			container.setLoading(false);
		}
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
					} else {
						//controller.syncDetail(container, selectedMasterId);
					}
					container.setLoading(false);
					controller.renewPlanSelectionChange(controller.masterStore.getById(selectedMasterId));
				}
			});
		} else {
			//controller.syncDetail(container, selectedMasterId);
		}
	},
	
	loadDetail: function(masterId, detailTable){
		var controller=this;
		
		controller.detailStore.proxy.extraParams={
			master_id: masterId
		};
		controller.detailStore.load(
			function(){
				detailTable.setDisabled(false);
			}
		);
	},
	
	filterRenewPlan: function(){
		var controller=this;
		
		controller.mainContainer.setLoading(true);
		controller.masterStore.proxy.extraParams={
			ddateb: Ext.getCmp('ddatebRenewPlan').getValue(),
			ddatee: Ext.getCmp('ddateeRenewPlan').getValue()
		};
		controller.masterStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при получении планируемых поставок");
				}
				controller.renewPlanSelectionChange();
				controller.mainContainer.setLoading(false);
				return true;
			}
		);
	},
	
	renewPlanSelectionChange: function(s){
		var controller=this;
		if(s!=null && s.length==1){
			var selectedId=s.get('id');
			
			if(selectedId!=controller.selectedRenewPlan && !s.phantom){
				// controller.selectedRenewPlan=selectedId;
				// controller.loadDetail(
					// selectedId,
					// controller.operationsStore,
					// Ext.getCmp('RenewPlanGoodsTable')
				// );
			} else {
				//Ext.getCmp('RenewPlanGoodsTable').setDisabled(false);
			}
		} else {
			//Ext.getCmp('RenewPlanGoodsTable').setDisabled(true);
		}
		Ext.getCmp('actionPanel').setDisabled(s==null || s.phantom);
		if(s!=null){
			var sorderBox = Ext.getCmp('actionSorderRenewPlan'),
				sorderStatus1Box = Ext.getCmp('actionSorderStatus1RenewPlan'),
				status2 = s.get('status2'),
				sorderStatus1 = s.get('sorder_status1');
			Ext.getCmp('actionRenewPlanType').setValue(s.get('renew_plan_type_id'));
			
			controller.siteToStoragesComboStore.clearFilter(true);
			controller.siteToStoragesComboStore.filter("site_from", s.get('site_from'));
			controller.siteToStoragesComboStore.filter("site_to", s.get('site_to'));
			
			var selectedStorage = controller.siteToStoragesComboStore.getAt(0);
			Ext.getCmp('actionSiteToStorageRenewPlan').setValue((selectedStorage!=null)?selectedStorage.get('id'):null);
			
			Ext.getCmp('actionPlanRenewPlan').setDisabled(status2==1);
			
			sorderBox.setRawValue(status2);
			sorderBox.setDisabled(sorderStatus1==1);
			sorderBox.lastValue = sorderBox.getValue();
			
			sorderStatus1Box.setDisabled((sorderStatus1!=0 && sorderStatus1!=1) || (status2!=1));
			sorderStatus1Box.setRawValue(sorderStatus1);
			sorderStatus1Box.lastValue = sorderStatus1Box.getValue();
		}
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.RenewPlan.Container');
		
		function getId(r){
			return (r!=null)?
					((r.getId()!=null && r.getId()!=0)?
						r.getId():
						r.get('id')
					):
					null;
		}
		
		controller.control({
			'#filterRenewPlan': {
				click: controller.filterRenewPlan
			},
			'#RenewPlanTable': {
				selectionchange: function(sm, selected, eOpts){
					var s=(selected!=null)?selected[0]:null;
					controller.renewPlanSelectionChange(s);
					return true;
				}
			},
			'#addRenewPlanGoods':{
				click: function(){
					var sm=Ext.getCmp('RenewPlanTable').getSelectionModel(),
						r = Ext.ModelManager.create({master_id: sm.getSelection()[0].getId()}, 'app.model.RenewPlan.RenewPlanGoodsModel');
					controller.detailStore.insert(0, r);
				}
			},
			'#saveRenewPlan': {
				click: function(){
					var selected=Ext.getCmp('RenewPlanTable').getSelectionModel().getSelection()[0];
					if(selected != null){
						selected.set('sum', controller.detailStore.sum('sum'));
					}
					controller.syncMaster(
						controller.mainContainer,
						getId(selected));
					return true;
				}
			},
			'#addRenewPlan':{
				click: function(){
					var sm=Ext.getCmp('RenewPlanTable').getSelectionModel(),
						r = Ext.ModelManager.create({
							send_ddate: Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d'),
							sup_ddate: Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d'),
							k_renew: 1,
							k_sens: 0.7,
							k_rem: 0.5
						}, 'app.model.RenewPlan.RenewPlanModel');
					controller.masterStore.insert(0, r);
					sm.select(r);
				}
			},
			'#refreshRenewPlanGoods': {
				click: function(){
					var selected=Ext.getCmp('RenewPlanTable').getSelectionModel().getSelection();
					if(selected!=null && selected.length>0){
						controller.loadDetail(
							getId(selected[0]),
							Ext.getCmp('RenewPlanGoodsTable')
						);
					}
				}
			},
			'#actionSorderRenewPlan': {
				change: function(field, newValue, oldValue, eOpts){
					var rec=Ext.getCmp('RenewPlanTable').getSelectionModel().getSelection()[0];
					controller.mainContainer.setLoading(true);
					Ext.Ajax.request({
						url: '/renew_plan/do_sorder',
						timeout: 600000,
						params: {
							id: rec.get("id"),
							site_to_storage: Ext.getCmp('actionSiteToStorageRenewPlan').getValue(),
							authenticity_token: window._token
						},
						callback: function(options, success, response){
							if(success!==true){
								controller.showServerError(response, options);
							} else {
								if(response.responseText=="lackvol"){
									Ext.Msg.alert("Внимание", "Заказ сформирован с отклонениями от плана!");
								}
							}
							
							controller.filterRenewPlan();
						}
					});

					return true;
				}
			},
			'#actionSorderStatus1RenewPlan': {
				change: function(field, newValue, oldValue, eOpts){
					var rec=Ext.getCmp('RenewPlanTable').getSelectionModel().getSelection()[0];
					if(rec.get("status2")==1){
						controller.mainContainer.setLoading(true);
						Ext.Ajax.request({
							url: '/renew_plan/do_sorder_status1',
							timeout: 600000,
							params: {
								id: rec.get("id"),
								authenticity_token: window._token
							},
							callback: function(options, success, response){
								if(success!==true){
									controller.showServerError(response, options);
								}
								controller.filterRenewPlan();
							}
						});
					}

					return true;
				}
			},
			'#actionPlanRenewPlan': {
				click: function(){
					var rec=Ext.getCmp('RenewPlanTable').getSelectionModel().getSelection()[0],
						renewPlanTypeId = Ext.getCmp('actionRenewPlanType').getValue();
					if((rec.get("sorder")==null || rec.get("sorder")=='') && renewPlanTypeId>0){
						controller.mainContainer.setLoading(true);
						Ext.Ajax.request({
							url: '/renew_plan/do_plan',
							timeout: 1200000,
							params: {
								id: rec.get("id"),
								renew_plan_type_id: renewPlanTypeId,
								authenticity_token: window._token
							},
							callback: function(options, success, response){
								if(success!==true){
									controller.showServerError(response, options);
								}
								controller.filterRenewPlan();
							}
						});
					}
				}
			}
		});
		
		Ext.getCmp('RenewPlanTable').getPlugin('rowEditingRenewPlan').addListener(
			"beforeedit",
			function(editor, e, eOpts){
				return (e.record.get('status2')!=1);
			}
		);
		Ext.getCmp('RenewPlanTable').getPlugin('rowEditingRenewPlan').addListener(
			"edit",
			function(editor, e, eOpts){
				controller.masterStore.proxy.extraParams={};
				controller.masterStore.sync({
					callback: function(batch){
						if(batch.exceptions.length>0){
							Ext.Msg.alert("Ошибка", batch.exceptions[0].getError().responseText);
						} else {
							e.record.set('renew_plan_type_id', null);
							e.record.set('sorder', null);
							e.record.set('sorder_ndoc', null);
							e.record.set('weight', null);
							e.record.set('volume', null);
							e.record.set('status2', 0);
							e.record.set('site_to_storage', null);
							e.record.set('sitevol', null);
						}
						Ext.getCmp('addRenewPlan').setDisabled(false);
						controller.renewPlanSelectionChange(e.record);
					}
				});
				return true;
			}
		);
		
		Ext.getCmp('RenewPlanTable').getPlugin('rowEditingRenewPlan').addListener(
			"canceledit",
			function(editor, e, eOpts){
				if(e.record.phantom){
					controller.masterStore.remove(e.record);
					Ext.getCmp('addRenewPlan').setDisabled(false);
				}
				return true;
			}
		);
	},
	
	loadDictionaries: function(){
		var controller=this,
			count=3;
		
		controller.mainContainer.setLoading(true);
		function checkLoading(val){
			if(val==0){
				controller.mainContainer.setLoading(false);
			}
		};
		
		controller.renewPlanTypesStore.load(
			function(records, operation, success){
				count--;
				checkLoading(count);
			}
		);
		controller.siteToStoragesStore.load(
			function(records, operation, success){
				count--;
				controller.siteToStoragesComboStore.loadData(records);
				checkLoading(count);
			}
		);
		
		controller.sitesStore.load(
			function(records, operation, success){
				count--;
				checkLoading(count);
			}
		);
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore = controller.getRenewPlanRenewPlansStore();
		controller.detailStore=controller.getRenewPlanRenewPlanGoodsStore();
		controller.sitesStore = controller.getRenewPlanSitesStore();
		controller.siteToStoragesStore = controller.getRenewPlanSiteToStoragesStore();
		controller.renewPlanTypesStore = controller.getRenewPlanRenewPlanTypesStore();
		controller.siteToStoragesComboStore = Ext.create('Ext.data.Store', {
		    model: 'app.model.RenewPlan.SiteStorageModel',
			proxy: {
		        type: 'memory'
			}
		});
		
		controller.loadDictionaries();
	},
	
	bindStores: function(){
		var controller=this,
			renewPlanTable=Ext.getCmp('RenewPlanTable');
		
		//Ext.getCmp('RenewPlanGoodsTable').reconfigure(controller.detailStore);
		renewPlanTable.reconfigure(controller.masterStore);
		
		Ext.getCmp('actionRenewPlanType').bindStore(controller.renewPlanTypesStore);
		Ext.getCmp('actionSiteToStorageRenewPlan').bindStore(controller.siteToStoragesComboStore);
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
			renewPlanTable = Ext.getCmp('RenewPlanTable'),
			renewPlanGoodsTable = Ext.getCmp('RenewPlanGoodsTable'),
			siteFromColumn=renewPlanTable.columns[3],
			siteToColumn=renewPlanTable.columns[4],
			PlanTypeColumn=renewPlanTable.columns[8],
			siteToStorageColumn=renewPlanTable.columns[13];
		
		controller.makeComboColumn(siteFromColumn, controller.sitesStore, controller.masterStore, 'site_from');
		controller.makeComboColumn(siteToColumn, controller.sitesStore, controller.masterStore, 'site_to');
		controller.makeComboColumn(PlanTypeColumn, controller.renewPlanTypesStore, controller.masterStore, 'renew_plan_type_id', true, true);
		controller.makeComboColumn(siteToStorageColumn, controller.siteToStoragesStore, controller.masterStore, 'site_to_storage', true, true);
		// controller.makeComboColumn(measureColumn, controller.measureStore, controller.detailStore, 'measure', false, true);
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
		
		controller.initTables();
	}
});