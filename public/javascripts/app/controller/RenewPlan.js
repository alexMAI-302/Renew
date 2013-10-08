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
		'RenewPlan.Sellers'
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
	lggroupsStore: null,
	sellersStore: null,
	sitesStore: null,
	siteToStoragesStore: null,
	renewPlanTypesStore: null,
	siteToStoragesComboStore: null,
	groupInfoStore: null,
	
	selectedRenewPlan: null,
	detailColumn: 11,
	
	getDetailColumn: function(){
		return this.detailColumn;
	},
	
	storeHasChanges: function(store){
		return (store.getNewRecords().length > 0) ||
			(store.getUpdatedRecords().length > 0) ||
			(store.getRemovedRecords().length > 0);
	},
	
	showServerError: function(response, options) {
		var controller=this;
		Ext.Msg.alert('Ошибка', response.responseText);
		controller.mainContainer.setLoading(false);
	},
	
	syncDetail: function(container, masterId){
		var controller=this;
		
		container.setLoading(true);
		if (controller.storeHasChanges(controller.detailStore)){
			controller.detailStore.proxy.extraParams={
				master_id: masterId
			};
			
			controller.detailStore.sync({
				callback: function(batch){
					if(batch.exceptions.length>0){
						Ext.Msg.alert("Ошибка", Ext.String.htmlEncode(batch.exceptions[0].getError().responseText));
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
			minvol,
			renewPlan = Ext.getCmp('RenewPlanTable').getSelectionModel().getSelection()[0];

		(controller.detailStore.snapshot || controller.detailStore.data)
		.each(
			function(r){
				curVol=r.get('volume');
				curDonevol=r.get('donevol');
				
				vol=(curDonevol==null)?curVol:curDonevol;
				weight = r.get('single_weight')*vol;
				minvol = r.get('minvol');
				pans = (minvol>0)?vol/minvol:0;
				goodsVolume = r.get('single_volume')*vol;
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
		if(renewPlan!=null){
			controller.groupInfoStore.loadData([
				{
					name: 'Вес по маш.',
					all: weightNull,
					num1: weight1,
					num2: weight2,
					siteRemains: renewPlan.get('sitevol') - volumeAll,
					truckRemains: renewPlan.get('truckvol') - volumeAll,
					positions: positions,
					pansAll: pansAll,
					donevol: donevol,
					weightAll: weightAll,
					volumeAll: volumeAll
				},
				{
					name: 'Под. по маш.',
					all: pansNull,
					num1: pans1,
					num2: pans2
				},
				{
					name: 'Объем по маш.',
					all: volumeNull,
					num1: volume1,
					num2: volume2
				}
			]);
		} else {
			controller.groupInfoStore.removeAll();
		}
	},
	
	recomputeGroupInfoOnTrucknum: function(e){
		var oldVal = e.originalValue,
			newVal = e.value,
			singleVolume = e.record.get('single_volume'),
			singleWeight = e.record.get('single_weight'),
			oldGoodsVolume = e.record.get('goods_volume'),
			oldWeight = e.record.get('weight'),
			oldPans = e.record.get('pans'),
			newGoodsVolume = newVal*singleVolume,
			newWeight = newVal*singleWeight,
			minvol = e.record.get('minvol'),
			newPans = (minvol!=null)?1.0*newVal/minvol:null,
			trucknum = e.record.get('trucknum'),
			infoRow = controller.groupInfoStore.getAt(0),
			pansRow = controller.groupInfoStore.getAt(1),
			volRow = controller.groupInfoStore.getAt(2),
			positions = infoRow.get('positions'),
			donevol = infoRow.get('donevol'),
			weightAll = infoRow.get('weightAll'),
			pansAll = infoRow.get('pansAll'),
			volumeAll = infoRow.get('volumeAll'),
			siteRemains = infoRow.get('siteRemains'),
			truckRemains = infoRow.set('truckRemains');
		
		e.record.set('goods_volume', newGoodsVolume);
		e.record.set('weight', newWeight);
		e.record.set('pans', newPans);
		
		function changeInfo(fieldName){
			var weight = infoRow.get(fieldName),
				pans = pansRow.get(fieldName),
				volume = volRow.get(fieldName);
			
			weight += newWeight - oldWeight;
			pans += newPans - oldPans;
			volume += newGoodsVolume - oldGoodsVolume;
			
			infoRow.set(fieldName, weight);
			pansRow.set(fieldName, pans);
			volRow.set(fieldName, volume);
		};
		
		positions += ((newVal>0)?1:0)-((oldVal>0)?1:0);
		donevol += newVal - oldVal;
		weightAll += newWeight - oldWeight;
		pansAll += newPans - oldPans;
		volumeAll += newGoodsVolume - oldGoodsVolume;
		siteRemains += newGoodsVolume - oldGoodsVolume;
		truckRemains += newGoodsVolume - oldGoodsVolume;
		if(trucknum==null){
			changeInfo('all');
		} else {
			if(trucknum==1){
				changeInfo('num1');
			} else {
				if(trucknum==2){
					changeInfo('num2');
				}
			}
		}
		
		infoRow.set('pansAll', pansAll);
		infoRow.set('volumeAll', volumeAll);
		infoRow.set('positions', positions);
		infoRow.set('donevol', donevol);
		infoRow.set('weightAll', weightAll);
		infoRow.set('siteRemains', siteRemains);
		infoRow.set('truckRemains', truckRemains);
	},
	
	saveDialogDetail: function(callback){
		var controller = this;
		if(controller.storeHasChanges(controller.detailStore)){
			Ext.Msg.show({
				title:'Сохранить изменения?',
				msg: 'Сохранить данные в таблице детализации?',
				buttons: Ext.Msg.YESNOCANCEL,
				icon: Ext.Msg.QUESTION,
				closable: true,
				fn: function(buttonId, text, opt){
					if(buttonId=='yes'){
						controller.mainContainer.setLoading(true);
						controller.detailStore.sync({
							callback: function(batch){
								if(batch.exceptions.length>0){
									Ext.Msg.alert("Ошибка", Ext.String.htmlEncode(batch.exceptions[0].getError().responseText));
								}
								controller.mainContainer.setLoading(false);
								callback.call(controller);
							}
						});
					} else {
						if(buttonId == 'no'){
							controller.detailStore.removeAll();
							callback.call(controller);
						}
					}
				}
			});
		} else {
			callback.call(controller);
		}
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
					Ext.Msg.alert("Ошибка", "Ошибка при получении позиций планируемых поставок <br/>" + operation.getError().responseText);
				} else {
					controller.computeGroupInfo();
					controller.postFilterRenewPlanGoods(
						Ext.getCmp('filterRenewPlanGoodsOnlyNotEmpty').getValue(),
						Ext.getCmp('filterLggroupRenewPlanGoods').getValue()
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
	
	postFilterRenewPlanGoods: function(showOnlyNotEmpty, lggroup){
		var controller=this;
		if(lggroup>0 || showOnlyNotEmpty==true){
			controller.detailStore.clearFilter(true);
			controller.detailStore.filter({
				filterFn: function(rec){
					return ((showOnlyNotEmpty!=true) || ((showOnlyNotEmpty==true) && (rec.get('volume')>0 || rec.get('isxls')==1))) &&
					(!(lggroup>0) || (lggroup>0 && rec.get('lggroup')==lggroup));
				}
			});
		} else {
			controller.detailStore.clearFilter();
		}
	},
	
	addRenewPlan: function(){
		var controller = this,
			renewPlanTable=Ext.getCmp('RenewPlanTable'),
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
		renewPlanTable.getPlugin('roweditingRenewPlan').startEdit(r, 0);
	},
	
	deleteRenewPlan: function(){
		var controller = this,
			sm = Ext.getCmp('RenewPlanTable').getSelectionModel();
					
		controller.masterStore.remove(sm.getSelection());
		if (controller.masterStore.getCount() > 0) {
			sm.select(0);
		}
	},
	
	getXLSGoods: function(XLSGoods){
		var controller = this,
			rpgs = XLSGoods.split('\n'),
			rpg=null,
			renewPlanGoodsArray=[];
		
		controller.mainContainer.setLoading(true);
		
		for(var i=0; i<rpgs.length; i++){
			if(rpgs[i]!=null && rpgs[i].length>0){
				rpg=rpgs[i].split('\t');
				renewPlanGoodsArray.push({name: rpg[0], donevol: parseInt(rpg[1])});
			}
		}
		
		Ext.Ajax.request({
			url: '/renew_plan/get_goods',
			timeout: 600000,
			method: 'POST',
			params: {
				authenticity_token: window._token
			},
			jsonData: {
				goods: renewPlanGoodsArray
			},
			callback: function(options, success, response){
				if(success!==true){
					controller.showServerError(response, options);
				} else {
					var data = eval('('+response.responseText+')');
					if(data!=null && data.length>0){
						var rpgs=[],
							error="";
						for(var i=0; i<data.length; i++){
							if(data[i].id != null){
								rpgs.push({
									isxls: 1,
									goods: data[i].id,
									goods_name: data[i].name,
									donevol: data[i].donevol
								});
							} else {
								error += data[i].name + "<br/>";
							}
						}
						if(error!=""){
							Ext.Msg.alert("Ошибка", "Не найдены товары с наименованиями:<br/>"+error);
						}
						controller.detailStore.loadData(rpgs, true);
					} else {
						Ext.Msg.alert("Ошибка", "Ничего не найдено");
					}
				}
				controller.mainContainer.setLoading(false);
			}
		});
	},
	
	actionSorderRenewPlan: function(){
		var controller = this,
			rec=Ext.getCmp('RenewPlanTable').getSelectionModel().getSelection()[0];
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
	},
	
	actionSorderStatus1RenewPlan: function(){
		var controller = this,
			rec=Ext.getCmp('RenewPlanTable').getSelectionModel().getSelection()[0];
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
	},
	
	actionPlanRenewPlan: function(){
		var controller = this,
			rec=Ext.getCmp('RenewPlanTable').getSelectionModel().getSelection()[0],
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
				click: function(){
					controller.saveDialogDetail(controller.filterRenewPlan);
				}
			},
			'#RenewPlanTable': {
				beforeselect: function(sm, record, index, eOpts){
					if(controller.storeHasChanges(controller.detailStore)){
						Ext.Msg.show({
							title:'Сохранить изменения?',
							msg: 'Сохранить данные в таблице детализации?',
							buttons: Ext.Msg.YESNOCANCEL,
							icon: Ext.Msg.QUESTION,
							closable: true,
							fn: function(buttonId, text, opt){
								if(buttonId=='yes'){
									controller.mainContainer.setLoading(true);
									controller.detailStore.sync({
										callback: function(batch){
											if(batch.exceptions.length>0){
												Ext.Msg.alert("Ошибка", Ext.String.htmlEncode(batch.exceptions[0].getError().responseText));
											}
											controller.mainContainer.setLoading(false);
											controller.renewPlanSelectionChange(record);
											sm.select(record);
										}
									});
									return false;
								} else {
									if(buttonId == 'no'){
										controller.renewPlanSelectionChange(record);
										sm.select(record, false, true);
									}
								}
							}
						});
						return false;
					} else {
						controller.renewPlanSelectionChange(record);
						return true;
					}
				}
			},
			'#saveRenewPlan': {
				click: function(){
					var selected=Ext.getCmp('RenewPlanTable').getSelectionModel().getSelection()[0];
					controller.syncMaster(
						controller.mainContainer,
						(selected!=null)?selected.get('id'):null);
				}
			},
			'#addRenewPlan':{
				click: function(){
					controller.saveDialogDetail(controller.addRenewPlan);
				}
			},
			'#deleteRenewPlan': {
				click: function(button){
					controller.saveDialogDetail(controller.deleteRenewPlan);
				}
			},
			'#addRenewPlanGoods':{
				click: function(){
					var sm=Ext.getCmp('RenewPlanTable').getSelectionModel(),
						r = Ext.ModelManager.create({master_id: sm.getSelection()[0].getId()}, 'app.model.RenewPlan.RenewPlanGoodsModel');
					controller.detailStore.insert(0, r);
				}
			},
			'#RenewPlanGoodsTable': {
				selectionchange: function(sm, selected, eOpts){
					var s=(selected!=null)?selected[0]:null,
						renewPlan=Ext.getCmp('RenewPlanTable').getSelectionModel().getSelection()[0];
					Ext.getCmp('deleteRenewPlanGoods').setDisabled(
						renewPlan==null || renewPlan.get('status2')==1 ||
						s==null || s.get('isxls')!=1
					);
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
					var sm = Ext.getCmp('RenewPlanGoodsTable').getSelectionModel();
					
					controller.detailStore.remove(sm.getSelection());
					if (controller.detailStore.getCount() > 0) {
						sm.select(0);
					}
				}
			},
			'#filterRenewPlanGoodsOnlyNotEmpty': {
				change: function(field, newValue, oldValue, eOpts){
					var controller=this;
					
					controller.postFilterRenewPlanGoods(
						newValue,
						Ext.getCmp('filterLggroupRenewPlanGoods').getValue()
					);
					return true;
				}
			},
			'#filterLggroupRenewPlanGoods': {
				change: function(field, newValue, oldValue, eOpts){
					var controller=this;
					
					if(newValue==null || newValue=="")
					{
						controller.postFilterRenewPlanGoods(
							null,
							Ext.getCmp('filterLggroupRenewPlanGoods').getValue()
						);
					}
					return true;
				},
				select: function(field, records, eOpts){
					var controller=this;
					
					controller.postFilterRenewPlanGoods(
						Ext.getCmp('filterRenewPlanGoodsOnlyNotEmpty').getValue(),
						records[0].get('id')
					);
					field.getStore().clearFilter(true);
					return true;
				}
			},
			'#XLSRenewPlanGoods': {
				//подразумеваем, что вставляют наименования товаров и/или количество
				change: function(field, newValue, oldValue, eOpts){
					if(newValue!=""){
						controller.getXLSGoods(newValue);
						field.setValue("");
					}
					
					return true;
				}
			},
			'#actionSorderRenewPlan': {
				change: function(field, newValue, oldValue, eOpts){
					field.setRawValue(oldValue);
					field.lastValue = oldValue;
					controller.saveDialogDetail(controller.actionSorderRenewPlan);

					return true;
				}
			},
			'#actionSorderStatus1RenewPlan': {
				change: function(field, newValue, oldValue, eOpts){
					field.setRawValue(oldValue);
					field.lastValue = oldValue;
					controller.saveDialogDetail(controller.actionSorderStatus1RenewPlan);

					return true;
				}
			},
			'#actionPlanRenewPlan': {
				click: function(){
					controller.saveDialogDetail(controller.actionPlanRenewPlan);
				}
			}
		});
		
		var renewPlanTable = Ext.getCmp('RenewPlanTable'),
			renewPlanPlugin = renewPlanTable.getPlugin('roweditingRenewPlan'),
			renewPlanGoodsTable = Ext.getCmp('RenewPlanGoodsTable'),
			renewPlanGoodsPlugin = renewPlanGoodsTable.getPlugin('celleditingRenewPlanGoods');
			
		renewPlanGoodsTable.getView().addListener(
			"itemkeydown",
			function(view, record, item, index, e, eOpts){
				if(e.getKey()==e.ENTER){
					renewPlanGoodsPlugin.startEdit(record, controller.getDetailColumn());
				}
				return true;
			}
		);
		
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
				if(renewPlanGoodsTable.columns[e.colIdx].text!='Наименование'){
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
		
		renewPlanGoodsPlugin.addListener(
			"edit",
			function(editor, e, eOpts){
				controller.detailColumn = e.colIdx;
				if(
					e.field=='donevol' ||
					e.field=='trucknum'
				){
					controller.computeGroupInfo();
				}
			}
		);
	},
	
	loadDictionaries: function(){
		var controller=this,
			count=5;
		
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
		
		controller.sellersStore.load(
			function(records, operation, success){
				count--;
				checkLoading(count);
			}
		);
		
		controller.groupInfoStore.loadData([
			{
				name: 'Вес по маш.'
			},
			{
				name: 'Под. по маш.'
			},
			{
				name: 'Объем по маш.'
			}
		]);
	},
	
	initStores: function(){
		var controller=this,
			renewPlanTable = Ext.getCmp('RenewPlanTable');
		
		controller.masterStore = renewPlanTable.getStore();
		controller.detailStore = Ext.getCmp('RenewPlanGoodsTable').getStore();
		controller.sitesStore = renewPlanTable.columns[3].store;
		controller.siteToStoragesStore = controller.getRenewPlanSiteToStoragesStore();
		controller.renewPlanTypesStore = Ext.getCmp('actionRenewPlanType').getStore();
		controller.goodsStore = controller.getRenewPlanGoodsStore();
		controller.lggroupsStore = Ext.getCmp('filterLggroupRenewPlanGoods').getStore();
		controller.sellersStore = Ext.getCmp('filterSellerRenewPlanGoods').getStore();
		controller.siteToStoragesComboStore = Ext.getCmp('actionSiteToStorageRenewPlan').getStore();
		controller.groupInfoStore = Ext.getCmp('RenewPlanGoodsInfoTable').getStore();
		
		controller.loadDictionaries();
	},
	
	changeIntSorter: function(column, tableStore, property){
		function transform(v){
			return (v!=null)?v:Number.NEGATIVE_INFINITY;
		};
		
		column.doSort = function(state){
			tableStore.sort({
				property: property,
				transform: transform,
				direction: state
			});
			return true;
		};
	},
	
	initTables: function(){
		var controller=this,
			renewPlanTable = Ext.getCmp('RenewPlanTable'),
			renewPlanGoodsTable = Ext.getCmp('RenewPlanGoodsTable'),
			
			goodsColumn=renewPlanGoodsTable.columns[0],
			donevolColumn=renewPlanGoodsTable.columns[12],
			truckColumn = renewPlanGoodsTable.columns[19];
		
		controller.changeIntSorter(donevolColumn, controller.detailStore, 'donevol');
		controller.changeIntSorter(renewPlanGoodsTable.columns[11], controller.detailStore, 'volume');
		
		function goodsRenderer(value, metaData, record){
			return record.get('goods_name');
		};
		goodsColumn.renderer = goodsRenderer;
		goodsColumn.doSort = function(state){
			controller.detailStore.sort({
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
					var s=renewPlanGoodsTable.getSelectionModel().getSelection()[0];
						
					component.setRawValue(s.get('goods_name'));
					component.doQuery(s.get('goods_name'));
					return true;
				}
			}
		});
		
		function rowNavigation(field, e, eOpts){
			var key=e.getKey(),
				sm=renewPlanGoodsTable.getSelectionModel(),
				r=sm.getSelection()[0];
				
			if(key==e.UP || key==e.DOWN){
				var direction = (key==e.UP)? -1 : (key==e.DOWN ? 1 : 0),
					index = controller.detailStore.indexOf(r) + direction,
					editingPlugin = renewPlanGoodsTable.getPlugin('celleditingRenewPlanGoods');
				
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
		
		function selectOnEdit(component){
			component.selectText();
		};
		
		donevolColumn.field = Ext.create('Ext.form.field.Text', {
			listeners: {
				focus: selectOnEdit,
				specialkey: {fn: rowNavigation, colId: 11}
			}
		});
		truckColumn.field = Ext.create('Ext.form.field.Text', {
			validator: function(v){
				return (v==null || v=="" || v==1 || v==2);
			},
			listeners: {
				focus: selectOnEdit,
				specialkey: {fn: rowNavigation, colId: 18}
			}
		});
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
		
		controller.initTables();
	}
});