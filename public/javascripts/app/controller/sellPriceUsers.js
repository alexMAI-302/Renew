Ext.define('app.controller.sellPriceUsers', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.sellPriceUsers.sellPriceUserModel',
		'app.model.valueModel'
	],
    init: function() {
	
		var finishUsers=false;
		var finishGroups=false;
	
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		}
	
		function filterData(){
			sellPricesUsersStore.proxy.extraParams={
				user_id: usersCombo.value,
				partner_group_id: partnerGroupsCombo.value};
			
			sellPricesUsersStore.load(function(){
				sellPricesUsersStore.each(function(record){
					record[record.persistenceProperty]["id"] = record.get("partner_group_id")+"_"+record.get("user_id");
					record.isDirty=false;
					return true;
				});
				mainContainer.setLoading(!(finishUsers && finishGroups));
			});
		}
	
		var usersStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'rest',
				url : '/sell_price_users/get_users',
				reader: {
					type: 'json'
				}
			}
		});
		
		var partnerGroupsStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'rest',
				url : '/sell_price_users/get_partner_groups',
				reader: {
					type: 'json'
				}
			}
		});
		
		var sellPricesUsersStore = Ext.create('Ext.data.Store', {
			model: 'app.model.sellPriceUsers.sellPriceUserModel',
			proxy: {
				type: 'rest',
				url : '/sell_price_users/sell_price_users',
				batchUpdateMode: 'complete',
				appendId: false,
				reader: {
					type: 'json'
				},
				writer: {
					type: 'json'
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
			renderTo: Ext.get('sell_price_users_js'),
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
		
		var partnerGroupsCombo=Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Подразделение',
			store: partnerGroupsStore,
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
		filterPanel.add(partnerGroupsCombo);
		filterPanel.add(filterDataButton);
		mainContainer.add(filterPanel);
		
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1,
			listeners: {
				beforeedit: function(e, options){
					var disabled=!e.record;
					sellPriceUsersPanel.down('#removeSellPriceUser').setDisabled(disabled);
					
					return e.record.get("is_new");
				}
			}
		});
		
		var gridId=Ext.id();
		var sellPriceUsersPanel=Ext.create('Ext.grid.Panel', {
			id: gridId,
			title: 'Права на подразделения для желтых ценников',
			store: sellPricesUsersStore,
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
							}
						}
					}) 
				},{
					width: 170,
					header: 'Подразделение',
					dataIndex: 'partner_group_id',
					renderer: function(value){
						var matching = partnerGroupsStore.queryBy(
							function(record, id){
								return record.get('id') == value;
							});
						return (matching.items[0]) ? matching.items[0].data.name : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: partnerGroupsStore,
						displayField: 'name',
						valueField: 'id',
						allowBlank: false,
						queryMode: 'local',
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

					var r = Ext.ModelManager.create(
					{
						is_new: true,
						user_id: 0,
						partner_group_id: 0
					},
					'app.model.sellPriceUsers.sellPriceUserModel');
					sellPricesUsersStore.insert(0, r);
					cellEditing.startEdit();
				}
			}, {
				itemId: 'removeSellPriceUser',
				text: 'Удалить запись',
				handler: function() {
					var sm = sellPriceUsersPanel.getSelectionModel();
					cellEditing.cancelEdit();
					sellPricesUsersStore.remove(sm.getSelection());
					if (sellPricesUsersStore.getCount() > 0) {
						sm.select(0);
					}
				},
				disabled: true
			}],
			listeners: {
				'selectionchange': function(view, records) {
					var disabled=!records.length;
					sellPriceUsersPanel.down('#removeSellPriceUser').setDisabled(disabled);
				}
			}
		});
		
		mainContainer.add(sellPriceUsersPanel);
		
		var saveSellPriceUsers=Ext.create('Ext.Button', {
			text    : 'Сохранить записи',
			scale: 'small',
			margin: '-10 0 0 10',
			handler : function() {
				sellPricesUsersStore.proxy.extraParams={};
				sellPricesUsersStore.sync();
			}
		});
		
		mainContainer.add(saveSellPriceUsers);
		
		mainContainer.setLoading(true);
		usersStore.load(function(records, operation, success) {
			finishUsers=true;
			usersCombo.select(records[0]);
			if (finishGroups){
				mainContainer.setLoading(false);
				filterData();
			}
		});
		partnerGroupsStore.load(function(records, operation, success) {
			finishGroups=true;
			partnerGroupsCombo.select(records[0]);
			if (finishUsers){
				mainContainer.setLoading(false);
				filterData();
			}
		});
	}
});