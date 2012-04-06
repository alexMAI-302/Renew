Ext.define('app.controller.ppsZoneUsers', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.ppsZoneUsers.zoneUserModel',
		'app.model.valueModel'
	],
    init: function() {
	
		var finishUsers=false;
		var finishZones=false;
	
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		}
	
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
		}
	
		var usersStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'rest',
				url : '/pps_zone_users/get_users',
				reader: {
					type: 'json'
				}
			}
		});
		
		var zonesStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'rest',
				url : '/pps_zone_users/get_zones',
				reader: {
					type: 'json'
				}
			}
		});
		
		var zoneUsersStore = Ext.create('Ext.data.Store', {
			model: 'app.model.ppsZoneUsers.zoneUserModel',
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
		});
		
		var mainContainer=Ext.create('Ext.container.Container', {
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
		});
		
		var filterPanel=Ext.create('Ext.form.Panel',{
			layout: {
				type: 'hbox'
			},
			defaults: {
				style: {
					margin: '5px'
				}
			}
		});
		
		var usersCombo=Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Пользователь',
			store: usersStore,
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			queryMode: 'local'
		});
		
		var zonesCombo=Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Зона',
			store: zonesStore,
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			queryMode: 'local'
		});
		
		var filterDataButton=Ext.create('Ext.Button', {
			text    : 'Фильтр',
			handler : filterData
		});
		
		filterPanel.add(usersCombo);
		filterPanel.add(zonesCombo);
		filterPanel.add(filterDataButton);
		mainContainer.add(filterPanel);
		
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1,
			listeners: {
				beforeedit: function(e, options){
					var disabled=!e.record;
					zoneUsersPanel.down('#removeZoneUser').setDisabled(disabled);
					
					return e.record.get("is_new");
				}
			}
		});
		
		var gridId=Ext.id();
		var zoneUsersPanel=Ext.create('Ext.grid.Panel', {
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
						listeners:{
							"focus": function (obj, options){
								obj.expand();
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
						listeners:{
							"focus": function (obj, options){
								obj.expand();
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
					
					var r = Ext.ModelManager.create({is_new: true}, 'app.model.ppsZoneUsers.zoneUserModel');

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