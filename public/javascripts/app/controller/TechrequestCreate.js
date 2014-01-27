Ext.define('app.controller.TechrequestCreate', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'TechrequestCreate.TechrequestCreateEntries',
		'TechrequestCreate.ZoneTypes',
		'TechrequestCreate.Zones',
		'TechrequestCreate.RequestTypes'
	],
	
	views: [
		'TechrequestCreate.Container'
	],
	
	mainContainer: null,
	masterStore: null,
	
	refreshTechrequestCreate: function(){
		var controller=this;
		
		controller.masterStore.proxy.extraParams={
			param_zoneid: Ext.getCmp('filterZone').getValue(),
			param_zonetypeid: Ext.getCmp('filterZoneType').getValue(),
			param_prefix: Ext.getCmp('filterTerminalPrefix').getValue()
		};
		
		controller.masterStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке записей таблицы");
				}
			}
		);
	},
	
	init: function() {
		var controller = this;
		
		controller.mainContainer=Ext.create('app.view.TechrequestCreate.Container');
				
		controller.control({
			'#TechrequestCreateTable': {
				selectionchange: function(sm, selected, eOpts){
					return true;
				}
			},
			'#filterRefreshRequest': {
				click: controller.refreshTechrequestCreate
			},
			'#filterCreateRequest': {
				click: function(){
					var selection = Ext.getCmp('TechrequestCreateTable').getSelectionModel().getSelection(), res='';
					var zoneVal = Ext.getCmp('filterZone').getValue();
					var requestTypeVal = Ext.getCmp('filterRequestType').getValue();
					var errMsg = '';
					var terminal_ids = [];
					
					// Считаем, что если getValue() == getRawValue(), то пользователь написал в списке что-то, для чего нет записи в выпадающем списке
					if (zoneVal==null || zoneVal==Ext.getCmp('filterZone').getRawValue() )	errMsg='Необходимо указать зону';					
					if (requestTypeVal==null || requestTypeVal==Ext.getCmp('filterRequestType').getRawValue() ) errMsg+= (errMsg==''? 'Н': ', н') + 'еобходимо указать тип задания';
					if (selection.length==0) errMsg+= (errMsg==''? 'Н': ', н') + 'еобходимо отметить хотя бы один терминал';
					errMsg+= (errMsg==''? '': '.');
					
					if (errMsg!='')
						Ext.Msg.alert('Недостаточно данных', errMsg);
				 	else {				
						for (var i = 0; i< selection.length; i++) {
							terminal_ids.push({id: selection[i].get('id')} );
						}
						
						Ext.Ajax.request({
							url: '/techrequest_create/techrequest_create_entries',
							timeout: 600000,
							method: 'POST',
							params: {
								authenticity_token: window._token,
								zone_id: zoneVal,
								requesttype_id: requestTypeVal
							},
							jsonData: {
								ids: terminal_ids
							},
							callback: function(options, success, response){
								if(success!==true) Ext.Msg.alert('Ошибка', response.responseText);
							}
						});
					};
					
					return true;
				} //click
			}, //#filterCreateRequest
			
			'#filterZoneType': {
				select: function(combo, selected, eOpts){
					var s=selected[0];
					
					controller.zonesStore.clearFilter(false);
					
					if (s!=null) {									
						controller.zonesStore.filter('zone_type', s.get('id') );
						Ext.getCmp('filterZone').setValue('');
					}
					
					return true;
				},
				change: function(combo, newValue, oldValue, eOpts){								
					if (newValue==null || newValue=='') {						
						controller.zonesStore.clearFilter(false);
					}
					
					return true;
				}
			}
		});	//controller.control
			
	},
	
	loadDictionaries: function(){
		var controller=this;
		
		controller.zoneTypesStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке справочника фильтра");
				}
			}
		);
		
		controller.zonesStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке справочника фильтра");
				};
			}
		);
		
		controller.requestTypesStore.load(
			function(records, operation, success){
				if(!success){
					Ext.Msg.alert("Ошибка", "Ошибка при загрузке справочника фильтра");
				};
			}
		);
		
	},
	
	initStores: function(){
		var controller=this;
		
		controller.masterStore=Ext.getCmp('TechrequestCreateTable').getStore();
		controller.zoneTypesStore = Ext.getCmp('filterZoneType').getStore();
		controller.zonesStore = Ext.getCmp('filterZone').getStore();
		controller.requestTypesStore = Ext.getCmp('filterRequestType').getStore();
		
		controller.loadDictionaries();
		//controller.refreshTechrequestCreate();
	},
	
	onLaunch: function(){
		var controller = this;
		
		controller.initStores();
	}
});