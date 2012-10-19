Ext.define('app.controller.ppsZoneUsers', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.valueModel'
	],
    init: function() {
    	Ext.define('zoneUserModel', {
			extend: 'Ext.data.Model',
			fields: [
			{name: 'id'			, type:'string', persist: false, defaultValue: "_"},
			{
				name: 'zone_id'	,
				type:'int',
				sortType: function(value){
					var v=null;
					zonesStore.each(function(r){
						if(r.get('id')==value){
							v=(r.get('name')!=null)? r.get('name') : '';
						}
						return v==null;
					});
					return v;
				}
			},
			{
				name: 'user_id'	,
				type:'int',
				sortType: function(value){
					var v=null;
					usersStore.each(function(r){
						if(r.get('id')==value){
							v=(r.get('name')!=null)? r.get('name') : '';
						}
						return v==null;
					});
					return v;
				}
			},
			{name: 'is_new'		, type:'boolean', persist: false, defaultValue: false}]
		});
	
		var finishUsers=false,
			finishZones=false,
			zonesStore = Ext.create('Ext.data.Store', {
				model: 'app.model.valueModel',
				proxy: {
					type: 'rest',
					url : '/pps_zone_users/get_zones',
					reader: {
						type: 'json'
					}
				}
			}),
			zoneUsersStore = Ext.create('Ext.data.Store', {
				model: 'zoneUserModel',
				proxy: {
					type: 'rest',
					url : '/pps_zone_users/zone_users',
					batchUpdateMode: 'complete',
					appendId: false,
					reader: {
						type: 'json'
					},
					writer: {
						type: 'json',
						writeAllFields: false
					}
				},
				getBatchListeners: function() {
					var listeners={};
					
					listeners.complete = function(batch, operation, options){
						filterData();
					};
					
					return listeners;
				}
			}),
			mainContainer=Ext.create('Ext.container.Container', {
				width: 1000,
				layout: {
					type: 'anchor'
				},
				renderTo: Ext.get('pps_zone_users_js'),
				defaults: {
					style: {
						margin: '10px'
					}
				}
			}),
			filterPanel=Ext.create('Ext.form.Panel',{
				layout: {
					type: 'hbox'
				},
				defaults: {
					style: {
						margin: '5px'
					}
				}
			}),
			zonesCombo=Ext.create('Ext.form.ComboBox', {
				fieldLabel: 'Зона',
				store: zonesStore,
				displayField: 'name',
				valueField: 'id',
				allowBlank: false,
				queryMode: 'local',
				"beforequery": function(){
					zonesStore.clearFilter(true);
					return true;
				}
			}),
			filterDataButton=Ext.create('Ext.Button', {
				text    : 'Фильтр',
				handler : filterData
			}),
			usersStore = Ext.create('Ext.data.Store', {
				model: 'app.model.valueModel',
				proxy: {
					type: 'rest',
					url : '/pps_zone_users/get_users',
					reader: {
						type: 'json'
					}
				}
			}),
			usersCombo=Ext.create('Ext.form.ComboBox', {
				fieldLabel: 'Пользователь',
				store: usersStore,
				displayField: 'name',
				valueField: 'id',
				allowBlank: false,
				queryMode: 'local',
				listeners: {
					beforequery: function(){
						usersStore.clearFilter(true);
						return true;
					}
				}
			}),
			cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1,
				listeners: {
					beforeedit: function(editor, e, options){
						var disabled=!e.record;
						zoneUsersPanel.down('#removeZoneUser').setDisabled(disabled);
						
						return e.record.get("is_new");
					}
				}
			}),
			gridId=Ext.id(),
			zoneUsersPanel=Ext.create('Ext.grid.Panel', {
				id: gridId,
				title: 'Права на зоны',
				store: zoneUsersStore,
				columns: [
					{
						width: 170,
						header: 'Пользователь',
						dataIndex: 'user_id',
						renderer: function(value){
							var matching = usersStore.queryBy(
								function(record, id){
									return record.get('id') == value;
								});
							return (matching.items[0]) ? matching.items[0].data.name : '';
						},
						field: Ext.create('Ext.form.ComboBox', {
							store: usersStore,
							displayField: 'name',
							valueField: 'id',
							allowBlank: false,
							queryMode: 'local',
							listeners:{
								"focus": function (obj, options){
									obj.expand();
								},
								"beforequery": function(){
									usersStore.clearFilter(true);
									return true;
								}
							}
						}) 
					},{
						width: 170,
						header: 'Зона',
						dataIndex: 'zone_id',
						renderer: function(value){
							var matching = zonesStore.queryBy(
								function(record, id){
									return record.get('id') == value;
								});
							return (matching.items[0]) ? matching.items[0].data.name : '';
						},
						field: Ext.create('Ext.form.ComboBox', {
							store: zonesStore,
							displayField: 'name',
							valueField: 'id',
							allowBlank: false,
							queryMode: 'local',
							listeners:{
								"focus": function (obj, options){
									obj.expand();
								},
								"beforequery": function(){
									zonesStore.clearFilter(true);
									return true;
								}
							}
						}) 
					}
				],
				selModel : Ext.create('Ext.selection.RowModel', {
					selType: 'rowmodel'
				}),
				plugins: [cellEditing],
				height: 400,
				tbar: [{
					text: 'Добавить запись',
					handler : function() {
						cellEditing.cancelEdit();
						
						var r = Ext.ModelManager.create(
							{
								user_id: usersCombo.getValue(),
								zone_id: zonesCombo.getValue(),
								is_new: true
							},
							'zoneUserModel');
	
						zoneUsersStore.insert(0, r);
						cellEditing.startEdit();
					}
				}, {
					itemId: 'removeZoneUser',
					text: 'Удалить запись',
					handler: function() {
						var sm = zoneUsersPanel.getSelectionModel();
						cellEditing.cancelEdit();
						zoneUsersStore.remove(sm.getSelection());
						if (zoneUsersStore.getCount() > 0) {
							sm.select(0);
						}
					},
					disabled: true
				}],
				listeners: {
					'selectionchange': function(view, records) {
						var disabled=!records.length;
						zoneUsersPanel.down('#removeZoneUser').setDisabled(disabled);
					}
				}
			});
	
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		};
	
		function filterData(){
			zoneUsersStore.proxy.extraParams={
				user_id: usersCombo.value,
				zone_id: zonesCombo.value};
			
			zoneUsersStore.load(function(){
				zoneUsersStore.each(function(record){
					record[record.persistenceProperty]["id"] = record.get("zone_id")+"_"+record.get("user_id");
					record.isDirty=false;
					return true;
				});
				mainContainer.setLoading(!(finishUsers && finishZones));
			});
		};
		
		filterPanel.add(usersCombo);
		filterPanel.add(zonesCombo);
		filterPanel.add(filterDataButton);
		mainContainer.add(filterPanel);
		
		mainContainer.add(zoneUsersPanel);
		
		var saveZoneUsers=Ext.create('Ext.Button', {
			text    : 'Сохранить записи',
			scale: 'small',
			margin: '-10 0 0 10',
			handler : function() {
				zoneUsersStore.proxy.extraParams={};
				zoneUsersStore.sync();
			}
		});
		
		mainContainer.add(saveZoneUsers);
		
		mainContainer.setLoading(true);
		usersStore.load(function(records, operation, success) {
			finishUsers=true;
			usersCombo.select(records[0]);
			if (finishZones){
				mainContainer.setLoading(false);
				filterData();
			}
		});
		zonesStore.load(function(records, operation, success) {
			finishZones=true;
			zonesCombo.select(records[0]);
			if (finishUsers){
				mainContainer.setLoading(false);
				filterData();
			}
		});
	}
});