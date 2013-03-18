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
		'RenewPlan.Lggroups',
		'RenewPlan.Goods',
		'RenewPlan.Sellers',
		'RenewPlan.Measures'
	],
	
	models: [
		'valueModel',
		'RenewPlan.RenewPlanModel',
		'RenewPlan.RenewPlanGoodsModel',
		'RenewPlan.SiteStorageModel',
		'RenewPlan.InfoTableModel'
	],
	
	views: [
		'RenewPlan.Container'
	],
	
	mainContainer: null,
	
	detailStore: null,
	masterStore: null,
	goodsStore: null,
	measuresStore: null,
	lggroupsStore: null,
	sellersStore: null,
	sitesStore: null,
	siteToStoragesStore: null,
	renewPlanTypesStore: null,
	siteToStoragesComboStore: null,
	groupInfoStore: null,
	
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
		
		if (controller.storeHasChanges(controller.detailStore)){
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
					}
					container.setLoading(false);
					controller.renewPlanSelectionChange(controller.masterStore.getById(selectedMasterId));
				}
			});
		}
	},
	
	computeGroupInfo: function(){
		var controller = this,
			curVol = curDonevol = vol = weigth = goodsVolume = trucknum = pans = 0.0,
			weightNull = weightAll = weight1 = weight2 = 0.0,
			pansNull = pansAll = pans1 = pans2 = 0.0,
			volumeNull = volumeAll = volume1 = volume2 = 0.0,
			positions=0,
			donevol = 0.0,
			renewPlan = Ext.getCmp('RenewPlanTable').getSelectionModel().getSelection()[0];
			
		controller.detailStore.each(
			function(r){
				curVol=r.get('volume');
				curDonevol=r.get('donevol');
				
				vol=(curDonevol==null)?curVol:curDonevol;
				weight = r.get('weight');
				pans = r.get('pans');
				goodsVolume = r.get('goods_volume');
				trucknum = r.get('trucknum');
				
				positions+=(vol>0)?1:0;
				donevol+=vol;
				weightAll+=weight;
				pansAll+=pans;
				volumeAll+=goodsVolume;
				if(trucknum==null){
					weightNull+=weight;
					pansNull+=pans;
					volumeNull+=goodsVolume;
				} else {
					if(trucknum==1){
						weight1+=weight;
						pans1+=pans;
						volume1+=goodsVolume;
					} else {
						if(trucknum==2){
							weight2+=weight;
							pans2+=pans;
							volume2+=goodsVolume;
						}
					}
				}
				
				return true;
			}
		);
		controller.groupInfoStore.loadData([
			{
				name: '',
				volume: volumeNull,
				pans: pansNull,
				weight: weightNull,
				siteRemains: renewPlan.get('sitevol') - volumeAll,
				truckRemains: renewPlan.get('truckvol') - volumeAll,
				positions: positions,
				pansAll: pansAll,
				donevol: donevol,
				weightAll: weightAll,
				volumeAll: volumeAll
			},
			{
				name: '№1',
				volume: volume1,
				pans: pans1,
				weight: weight1
			},
			{
				name: '№2',
				volume: volume2,
				pans: pans2,
				weight: weight2
			}
		]);
	},
	
	loadDetail: function(masterId, detailTable){
		var controller=this;
		
		controller.detailStore.proxy.extraParams={
			master_id: masterId,
			lggroup_id: Ext.getCmp('filterLggroupRenewPlanGoods').getValue(),
			seller_id: Ext.getCmp('filterSellerRenewPlanGoods').getValue()
		};
		controller.detailStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при получении позиций планируемых поставок");
				} else {
					controller.computeGroupInfo();
					controller.postFilterRenewPlanGoods(
						Ext.getCmp('filterRenewPlanGoodsOnlyNotEmpty').getValue()
					);
				}
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
		if(s!=null){
			var selectedId=s.get('id');
			
			if(selectedId!=controller.selectedRenewPlan){
				if(!s.phantom){
					controller.selectedRenewPlan=selectedId;
					controller.loadDetail(
						selectedId,
						Ext.getCmp('RenewPlanGoodsTable')
					);
				} else {
					Ext.getCmp('RenewPlanGoodsTable').setDisabled(true);
				}
			} else {
				Ext.getCmp('RenewPlanGoodsTable').setDisabled(false);
			}
		} else {
			Ext.getCmp('deleteRenewPlan').setDisabled(false);
			Ext.getCmp('RenewPlanGoodsTable').setDisabled(true);
		}
		Ext.getCmp('actionPanel').setDisabled(s==null || s.phantom);
		if(s!=null){
			var sorderBox = Ext.getCmp('actionSorderRenewPlan'),
				sorderStatus1Box = Ext.getCmp('actionSorderStatus1RenewPlan'),
				status2 = s.get('status2'),
				sorderStatus1 = s.get('sorder_status1');
				
			Ext.getCmp('deleteRenewPlan').setDisabled(false);
			Ext.getCmp('actionRenewPlanType').setValue(s.get('renew_plan_type_id'));
			
			controller.siteToStoragesComboStore.clearFilter(true);
			controller.siteToStoragesComboStore.filter("site_from", s.get('site_from'));
			controller.siteToStoragesComboStore.filter("site_to", s.get('site_to'));
			
			var selectedStorage = controller.siteToStoragesComboStore.getAt(0);
			Ext.getCmp('actionSiteToStorageRenewPlan').setValue(
				(s.get('site_to_storage')!=null)?
					s.get('site_to_storage'):
					((selectedStorage!=null)?
						(selectedStorage.get('selected')):
						null)
			);
			
			Ext.getCmp('actionPlanRenewPlan').setDisabled(status2==1);
			
			sorderBox.setRawValue(status2);
			sorderBox.setDisabled(sorderStatus1==1);
			sorderBox.lastValue = sorderBox.getValue();
			
			sorderStatus1Box.setDisabled((sorderStatus1!=0 && sorderStatus1!=1) || (status2!=1));
			sorderStatus1Box.setRawValue(sorderStatus1);
			sorderStatus1Box.lastValue = sorderStatus1Box.getValue();
		} else {
			Ext.getCmp('deleteRenewPlan').setDisabled(true);
		}
	},
	
	postFilterRenewPlanGoods: function(showOnlyNotEmpty){
		var controller=this;
		if(showOnlyNotEmpty==true){
			controller.detailStore.filterBy(
				function(rec, id){
					return rec.get('donevol')>0;
				}
			);
		} else {
			controller.detailStore.clearFilter();
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
					controller.syncMaster(
						controller.mainContainer,
						(selected!=null)?selected.get('id'):null);
					return true;
				}
			},
			'#addRenewPlan':{
				click: function(){
					var renewPlanTable=Ext.getCmp('RenewPlanTable'),
						sm=renewPlanTable.getSelectionModel(),
						r = Ext.ModelManager.create({
							send_ddate: Ext.Date.add(Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d'), Ext.Date.DAY, 1),
							sup_ddate: Ext.Date.add(Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d'), Ext.Date.DAY, 2),
							truckvol: 45,
							k_renew: 1,
							k_sens: 0.7,
							k_rem: 0.5
						}, 'app.model.RenewPlan.RenewPlanModel');
					controller.masterStore.insert(0, r);
					renewPlanTable.getPlugin('rowEditingRenewPlan').startEdit(r, 0);
				}
			},
			'#deleteRenewPlan': {
				click: function(button){
					var sm = Ext.getCmp('RenewPlanTable').getSelectionModel();
					
					controller.masterStore.remove(sm.getSelection());
					if (controller.masterStore.getCount() > 0) {
						sm.select(0);
					}
				}
			},
			'#RenewPlanGoodsTable': {
				selectionchange: function(sm, selected, eOpts){
					var s=(selected!=null)?selected[0]:null;
					Ext.getCmp('deleteRenewPlanGoods').setDisabled(s==null || s.get('isxls')==1);
					return true;
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
			'#saveRenewPlanGoods': {
				click: function(){
					var selected=Ext.getCmp('RenewPlanTable').getSelectionModel().getSelection()[0];
					controller.syncDetail(controller.mainContainer, getId(selected));
					return true;
				}
			},
			'#addRenewPlanGoods':{
				click: function(){
					var r = Ext.ModelManager.create({
							isxls: 1
						}, 'app.model.RenewPlan.RenewPlanGoodsModel');
					controller.detailStore.insert(0, r);
				}
			},
			'#deleteRenewPlanGoods':{
				click: function(){
					var sm = Ext.getCmp('RenewPlanTableGoods').getSelectionModel();
					
					controller.detailStore.remove(sm.getSelection());
					if (controller.detailStore.getCount() > 0) {
						sm.select(0);
					}
				}
			},
			'#filterRenewPlanGoodsOnlyNotEmpty': {
				change: function(field, newValue, oldValue, eOpts){
					var controller=this;
					
					controller.postFilterRenewPlanGoods(newValue);
					return true;
				}
			},
			'#XLSRenewPlanGoods': {
				//подразумеваем, что вставляют наименования товаров и/или количество
				change: function(field, newValue, oldValue, eOpts){
					var rpgs = newValue.split('\n'),
						rpg=null,
						renewPlanGoodsArray=[];
					
					if(newValue!=""){
						for(var i=0; i<rpgs.length; i++){
							if(rpgs[i]!=null && rpgs[i].length>0){
								rpg=rpgs[i].split('\t');
								renewPlanGoodsArray[i]=[rpg[0], rpg[1]];
								Ext.Ajax.request({
									num: i,
									url: '/util_data/get_goods',
									timeout: 600000,
									method: 'GET',
									params: {
										query: renewPlanGoodsArray[i][0],
										authenticity_token: window._token
									},
									callback: function(options, success, response){
										if(success!==true){
											controller.showServerError(response, options);
										} else {
											var data = eval('('+response.responseText+')');
											if(data!=null && data.length==1){
												var r = Ext.ModelManager.create({
													isxls: 1,
													goods_id: data.id,
													goods_name: renewPlanGoodsArray[options.num][0],
													donevol: renewPlanGoodsArray[options.num][1]
												}, 'app.model.RenewPlan.RenewPlanGoodsModel');
												
												controller.detailStore.add(r);
											}
											if(data==null || data.length==0){
												Ext.Msg.alert("Ошибка", "Не найдено товаров с именем "+renewPlanGoodsArray[options.num][0]);
											}
											if(data!=null && data.length>1){
												Ext.Msg.alert("Ошибка", "Найдено более одного товара с именем "+renewPlanGoodsArray[options.num][0]);
											}
										}
									}
								});
							}
						}
						field.setValue("");
					}
					
					return true;
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
		
		var renewPlanPlugin = Ext.getCmp('RenewPlanTable').getPlugin('rowEditingRenewPlan'),
			renewPlanGoodsPlugin=Ext.getCmp('RenewPlanGoodsTable').getPlugin('cellEditingRenewPlanGoods');
		renewPlanPlugin.addListener(
			"beforeedit",
			function(editor, e, eOpts){
				return (e.record.get('status2')!=1);
			}
		);
		renewPlanPlugin.addListener(
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
		
		renewPlanPlugin.addListener(
			"canceledit",
			function(editor, e, eOpts){
				if(e.record.phantom){
					controller.masterStore.remove(e.record);
					Ext.getCmp('addRenewPlan').setDisabled(false);
				}
				return true;
			}
		);
		
		renewPlanGoodsPlugin.addListener(
			"beforeedit",
			function(editor, e, eOpts){
				if(e.colIdx!=0){
					return true;
				} else {
					r=Ext.getCmp('RenewPlanTable').getSelectionModel().getSelection()[0];
					if(r.get('status1')!=1 && r.get('status2')!=1 && e.record.get('isxls')){
						return true;
					} else {
						return false;
					}
				}
			}
		);
	},
	
	loadDictionaries: function(){
		var controller=this,
			count=6;
		
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
		
		controller.lggroupsStore.load(
			function(records, operation, success){
				count--;
				checkLoading(count);
			}
		);
		
		controller.measuresStore.load(
			function(records, operation, success){
				count--;
				checkLoading(count);
			}
		);
		
		controller.sellersStore.load(
			function(records, operation, success){
				count--;
				checkLoading(count);
			}
		);
		
		controller.groupInfoStore.loadData([
			{
				name: ''
			},
			{
				name: '№1'
			},
			{
				name: '№2'
			}
		]);
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore = controller.getRenewPlanRenewPlansStore();
		controller.detailStore=controller.getRenewPlanRenewPlanGoodsStore();
		controller.sitesStore = controller.getRenewPlanSitesStore();
		controller.siteToStoragesStore = controller.getRenewPlanSiteToStoragesStore();
		controller.renewPlanTypesStore = controller.getRenewPlanRenewPlanTypesStore();
		controller.measuresStore = controller.getRenewPlanMeasuresStore();
		controller.goodsStore = controller.getRenewPlanGoodsStore();
		controller.lggroupsStore = controller.getRenewPlanLggroupsStore();
		controller.sellersStore = controller.getRenewPlanSellersStore();
		controller.siteToStoragesComboStore = Ext.create('Ext.data.Store', {
		    model: 'app.model.RenewPlan.SiteStorageModel',
			proxy: {
		        type: 'memory'
			}
		});
		controller.groupInfoStore = Ext.create('Ext.data.Store', {
		    model: 'app.model.RenewPlan.InfoTableModel',
			proxy: {
		        type: 'memory'
			}
		});
		
		controller.loadDictionaries();
	},
	
	bindStores: function(){
		var controller=this,
			renewPlanTable=Ext.getCmp('RenewPlanTable');
		
		Ext.getCmp('RenewPlanGoodsTable').reconfigure(controller.detailStore);
		Ext.getCmp('RenewPlanGoodsInfoTable').reconfigure(controller.groupInfoStore);
		renewPlanTable.reconfigure(controller.masterStore);
		
		Ext.getCmp('actionRenewPlanType').bindStore(controller.renewPlanTypesStore);
		Ext.getCmp('actionSiteToStorageRenewPlan').bindStore(controller.siteToStoragesComboStore);
		Ext.getCmp('filterLggroupRenewPlanGoods').bindStore(controller.lggroupsStore);
		Ext.getCmp('filterSellerRenewPlanGoods').bindStore(controller.sellersStore);
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
			siteToStorageColumn=renewPlanTable.columns[13],
			
			goodsColumn=renewPlanGoodsTable.columns[0],
			measureColumn=renewPlanGoodsTable.columns[19],
			donevolColumn=renewPlanGoodsTable.columns[11],
			truckColumn = renewPlanGoodsTable.columns[18];
		
		controller.makeComboColumn(siteFromColumn, controller.sitesStore, controller.masterStore, 'site_from');
		controller.makeComboColumn(siteToColumn, controller.sitesStore, controller.masterStore, 'site_to');
		controller.makeComboColumn(PlanTypeColumn, controller.renewPlanTypesStore, controller.masterStore, 'renew_plan_type_id', true, true);
		controller.makeComboColumn(siteToStorageColumn, controller.siteToStoragesStore, controller.masterStore, 'site_to_storage', true, true);
		
		function goodsRenderer(value, metaData, record){
			return record.get('goods_name');
		};
		goodsColumn.renderer = goodsRenderer;
		goodsColumn.doSort = function(state){
			tableStore.sort({
				property: 'goods_name',
				direction: state
			});
			return true;
		};
		goodsColumn.field = Ext.create('Ext.form.ComboBox', {
			store: controller.goodsStore,
			displayField: 'name',
			valueField: 'id',
			value: "",
			autoSelect: true,
			listeners: {
				select: function(field, records, eOpts){
					var s=renewPlanGoodsTable.getSelectionModel().getSelection()[0];
					s.set('goods_name', records[0].get('name'));
					return true;
				},
				focus: function(component, e, eOpts){
					var s=renewPlanGoodsTable.getSelectionModel().getSelection()[0]
						
					component.setRawValue(s.get('goods_name'));
					component.doQuery(s.get('goods_name'));
					return true;
				}
			}
		});
		
		controller.makeComboColumn(measureColumn, controller.measuresStore, controller.detailStore, 'measure', false, true);
		
		function rowNavigation(field, e, eOpts){
			var key=e.getKey(),
				sm=renewPlanGoodsTable.getSelectionModel(),
				r=sm.getSelection()[0];
				
			if(key==e.UP || key==e.DOWN){
				var direction = (key==e.UP)? -1 : (key==e.DOWN ? 1 : 0),
					index = controller.detailStore.indexOf(r) + direction,
					editingPlugin = renewPlanGoodsTable.getPlugin('cellEditingRenewPlanGoods');
				
				e.stopEvent();
				if(index>=0 && index<controller.detailStore.getCount()){
					var newR = controller.detailStore.getAt(index);
					sm.select(newR, true);
					editingPlugin.startEdit(newR, eOpts.colId);
				}
			} else {
				if(key==e.ENTER){
					renewPlanGoodsTable.getView().focusCell({row: r, column: eOpts.colId});
				}
			}
			
			return true;
		};
		
		donevolColumn.field = Ext.create('Ext.form.field.Text', {
			listeners: {
				specialkey: {fn: rowNavigation, colId: 11}
			}
		});
		truckColumn.field = Ext.create('Ext.form.field.Text', {
			validator: function(v){
				return (v==null || v=="" || v==1 || v==2);
			},
			listeners: {
				specialkey: {fn: rowNavigation, colId: 18}
			}
		});
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.bindStores();
		
		controller.initTables();
	}
});