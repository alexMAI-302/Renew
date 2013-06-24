Ext.define('app.controller.movementDiff', {
    extend: 'Ext.app.Controller',
	stores: [
		'movementDiff.actionType',
		'movementDiff.movementDiff',
		'movementDiff.ndocsSOClear',
		'movementDiff.ndocsSupClear',
		'movementDiff.sitesDestClear',
		'movementDiff.sitesSrcClear',
		'movementDiff.sites'
	],
	
	models: [
		'valueModel',
		'movementDiff.movementDiffModel'
	],
	
	views: [
		'movementDiff.MainContainer'
	],
	
	sitesStore: null,
	movementDiffStore: null,
	actionTypeStore: null,
	sitesSrcClearStore: null,
	sitesDestClearStore: null,
	ndocsSOClearStore: null,
	ndocsSupClearStore: null,
	
	mainContainer: null,
	
	onActionComboEvent: function(field){
		if(field.getValue() != null){
			field.ownerCt.down('#clearDiff').show();
		}
	},
	
	loadMovementDiff: function(){
		var controller=this,
			ddateb = new Date(Ext.getCmp('ddatebDiffs').getValue()),
			ddatee = new Date(Ext.getCmp('ddatebDiffs').getValue()),
			siteFrom = Ext.getCmp('siteFromDiffs').getValue(),
			siteTo = Ext.getCmp('siteToDiffs').getValue();
		
		controller.mainContainer.setLoading(true);

		controller.movementDiffStore.proxy.extraParams={
			ddateb: Ext.Date.format(ddateb, 'Y-m-d'),
			ddatee: Ext.Date.format(ddatee, 'Y-m-d'),
			site_from: siteFrom,
			site_to: siteTo
		};
		
		controller.movementDiffStore.load(
			function(records, operation, success){
				if(success){
					var siteSrcArray=controller.movementDiffStore.collect('site_src_id'),
						siteDestArray=controller.movementDiffStore.collect('site_dest_id'),
						ndocSOArray=controller.movementDiffStore.collect('ndoc_so'),
						ndocSupArray=controller.movementDiffStore.collect('ndoc_sup');
					var ndocSO, ndocSup;
						
					controller.sitesSrcClearStore.removeAll();
					controller.sitesDestClearStore.removeAll();
					controller.ndocsSOClearStore.removeAll();
					controller.ndocsSupClearStore.removeAll();
					
					controller.sitesStore.each(function(record){
						for(var i=0; i<siteSrcArray.length; i++){
							if(record.get('id')==siteSrcArray[i] || record.get('id')==-1){
								controller.sitesSrcClearStore.add(record);
							}
						}
						return true;
					});
					
					controller.sitesStore.each(function(record){
						for(var i=0; i<siteDestArray.length; i++){
							if(record.get('id')==siteDestArray[i] || record.get('id')==-1){
								controller.sitesDestClearStore.add(record);
							}
						}
						return true;
					});
					
					for(var i=0; i<ndocSOArray.length; i++){
						ndocSO = Ext.ModelManager.create({
							id	: ndocSOArray[i],
							name: ndocSOArray[i]
						}, 'app.model.valueModel');
						controller.ndocsSOClearStore.add(ndocSO);
					}
					
					for(var i=0; i<ndocSupArray.length; i++){
						ndocSup = Ext.ModelManager.create({
							id	: ndocSupArray[i],
							name: ndocSupArray[i]
						}, 'app.model.valueModel');
						controller.ndocsSupClearStore.add(ndocSup);
					}
					
					controller.mainContainer.setLoading(false);
				}
				else {
					Ext.Msg.alert('Ошибка', 'Попробуйте еще раз.');
					controller.mainContainer.setLoading(false);
				}
			});
		},
	
    init: function() {
		var controller = this;
		
		controller.mainContainer = Ext.create('app.view.movementDiff.MainContainer');
		
		controller.control({
			'#selectedDiffs': {
				checkchange: function(){
					if(controller.movementDiffStore.collect('to_clear').length>1){
						Ext.getCmp('clearDiff').show();
					} else {
						Ext.getCmp('clearDiff').hide();
					}
				}
			},
			'#actionType' : {
				change: function(field, newValue, oldValue, eOpts){
					field.ownerCt.items.each(function(i){
						i.hide();
					});
					Ext.getCmp('selectedDiffs').hide();
					Ext.getCmp('actionType').show();
					switch(newValue){
						case 1:
							Ext.getCmp('siteSrcAction').show();
						break;
						case 2:
							Ext.getCmp('siteDestAction').show();
						break;
						case 3:
							Ext.getCmp('ndocSOAction').show();
						break;
						case 4:
							Ext.getCmp('ndocSupAction').show();
						break;
						case 5:
							Ext.getCmp('selectedDiffs').show();
							if(newValue==5){
								//если больше одного уникального значения, т.е. если есть выбранные для списания позиции
								if(controller.movementDiffStore.collect('to_clear').length>1){
									field.ownerCt.down('#clearDiff').show();
								}
							}
						break;
					}
				}
			},
			'#siteSrcAction, #siteDestAction, #ndocSOAction, #ndocSupAction': {
				show: controller.onActionComboEvent,
				change: controller.onActionComboEvent
			},
			'#clearDiff': {
				click: function(button, e){
					var ids = [];
					
					switch(button.ownerCt.down('#actionType').value){
						case 1:
							var siteSrc=button.ownerCt.down('#siteSrcAction').getValue();
							controller.movementDiffStore.each(function(record){
								if(record.get('site_src_id')==siteSrc || siteSrc==-1){
									ids.push(record.get('id'));
								}
								return true;
							});
						break;
						case 2:
							var siteDest = button.ownerCt.down('#siteDestAction').getValue();
							controller.movementDiffStore.each(function(record){
								if(record.get('site_dest_id')==siteDest || siteDest==-1){
									ids.push(record.get('id'));
								}
								return true;
							});
						break;
						case 3:
							var ndocSO = button.ownerCt.down('#ndocSOAction').getValue();
							controller.movementDiffStore.each(function(record){
								if(record.get('ndoc_so')==ndocSO || ndocSO==-1){
									ids.push(record.get('id'));
								}
								return true;
							});
						break;
						case 4:
							var ndocSup = button.ownerCt.down('#ndocSupAction').getValue();
							controller.movementDiffStore.each(function(record){
								if(record.get('ndoc_sup')==ndocSup || ndocSup==-1){
									ids.push(record.get('id'));
								}
								return true;
							});
						break;
						case 5:
							controller.movementDiffStore.each(function(record){
								if(record.get('to_clear')){
									ids.push(record.get('id'));
								}
								return true;
							});
						break;
					}
					
					controller.mainContainer.setLoading(true);
					Ext.Ajax.request({
						params:{
							authenticity_token: window._token
						},
						jsonData: {
							ids: ids
						},
						method: 'post',
						url: '/movement_diff/clear_diff',
						success: function(response){
							controller.loadMovementDiff();
						},
						failure: showServerError
					});
				}
			},
			'#filterDiffs': {
				click: controller.loadMovementDiff
			}
		});
		
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			controller.mainContainer.setLoading(false);
		}
		
		Ext.Ajax.timeout = 60000;
		Ext.Ajax.request.failure = showServerError;
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.sitesStore = controller.getMovementDiffSitesStore();
		controller.movementDiffStore = controller.getMovementDiffMovementDiffStore();
		controller.actionTypeStore = controller.getMovementDiffActionTypeStore();
		controller.sitesSrcClearStore = controller.getMovementDiffSitesSrcClearStore();
		controller.sitesDestClearStore = controller.getMovementDiffSitesDestClearStore();
		controller.ndocsSOClearStore = controller.getMovementDiffNdocsSOClearStore();
		controller.ndocsSupClearStore = controller.getMovementDiffNdocsSupClearStore();
		
		function sitesRenderer(value){
			var matching=null;
			controller.sitesStore.each(function(record){
				if(record.get('id')==value){
					matching=record.get('name');
				}
				return !matching;
			});
			return matching;
		};
		//ХАРДКОД НОМЕРА КОЛОНКИ!!!
		Ext.getCmp('movementDiffTable').columns[0].renderer=sitesRenderer;
		Ext.getCmp('movementDiffTable').columns[1].renderer=sitesRenderer;
		
		Ext.getCmp('siteFromDiffs').bindStore(controller.sitesStore);
		Ext.getCmp('siteToDiffs').bindStore(controller.sitesStore);
		Ext.getCmp('movementDiffTable').reconfigure(controller.movementDiffStore);
		Ext.getCmp('actionType').bindStore(controller.actionTypeStore);
		Ext.getCmp('siteSrcAction').bindStore(controller.sitesSrcClearStore);
		Ext.getCmp('siteDestAction').bindStore(controller.sitesDestClearStore);
		Ext.getCmp('ndocSOAction').bindStore(controller.ndocsSOClearStore);
		Ext.getCmp('ndocSupAction').bindStore(controller.ndocsSupClearStore);
		
		controller.sitesStore.addListener(
			"load",
			function(store, records, successful, operation, options ){
				if(successful==true){
					var r=Ext.ModelManager.create({id: -1, name : 'ВСЕ'}, 'app.model.valueModel');
					store.insert(0, r);
					Ext.getCmp('siteFromDiffs').select(r);
					Ext.getCmp('siteToDiffs').select(r);
				}
			}
		);
	}
});