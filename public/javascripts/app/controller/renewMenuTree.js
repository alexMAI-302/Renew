Ext.define('app.controller.renewMenuTree', {
    extend: 'Ext.app.Controller',
	models: [
		'app.model.valueModel',
		'app.model.renewMenuTree.menuTreeModel'
	],
    init: function() {
	
		var finishMainItems=false;
		var finishItems=false;
	
		function showServerError(response, options) {
			Ext.Msg.show({
				title: 'Ошибка',
				msg: response.responseText,
				modal: true,
				autoScroll: true,
				buttons: Ext.Msg.OK
			});
			mainContainer.setLoading(false);
		};
		
		Ext.Ajax.request.failure = showServerError;
	
		function filterData(){
			menuTreeStore.proxy.extraParams={
				parent_id: mainItemsCombo.value};
			
			menuTreeStore.load(function(){
				mainContainer.setLoading(!(finishMainItems && finishItems));
			});
		}
	
		var mainItemsStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'rest',
				url : '/renew_menu_tree/get_main_items',
				reader: {
					type: 'json'
				}
			}
		});
		
		var itemsStore = Ext.create('Ext.data.Store', {
			model: 'app.model.valueModel',
			proxy: {
				type: 'rest',
				url : '/renew_menu_tree/get_items',
				reader: {
					type: 'json'
				}
			}
		});
		
		var menuTreeStore = Ext.create('Ext.data.Store', {
			model: 'app.model.renewMenuTree.menuTreeModel',
			proxy: {
				type: 'rest',
				url : '/renew_menu_tree/sub_items',
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
			renderTo: Ext.get('renew_menu_tree_js'),
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
		
		var mainItemsCombo=Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Главный пункт меню',
			store: mainItemsStore,
			displayField: 'name',
			valueField: 'id',
			allowBlank: false,
			queryMode: 'local'
		});
		
		var filterDataButton=Ext.create('Ext.Button', {
			text    : 'Фильтр',
			handler : filterData
		});
		
		filterPanel.add(mainItemsCombo);
		filterPanel.add(filterDataButton);
		mainContainer.add(filterPanel);
		
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1,
			listeners: {
				beforeedit: function(e, options){
					var disabled=!e.record;
					menuTreePanel.down('#removeItem').setDisabled(disabled);
					
					return e.record.get("is_new");
				}
			}
		});
		
		var gridId=Ext.id();
		var menuTreePanel=Ext.create('Ext.grid.Panel', {
			id: gridId,
			title: 'Пункты меню',
			store: menuTreeStore,
			columns: [
				{
					width: 170,
					header: 'Главный пункт меню',
					dataIndex: 'parent_id',
					renderer: function(value){
						var matching = mainItemsStore.queryBy(
							function(record, id){
								return record.get('id') == value;
							});
						return (matching.items[0]) ? matching.items[0].data.name : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: mainItemsStore,
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
					header: 'Пункт меню',
					dataIndex: 'child_id',
					renderer: function(value){
						var matching = itemsStore.queryBy(
							function(record, id){
								return record.get('id') == value;
							});
						return (matching.items[0]) ? matching.items[0].data.name : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: itemsStore,
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
						parent_id: mainItemsCombo.value,
						child_id: 0
					},
					'app.model.renewMenuTree.menuTreeModel');
					menuTreeStore.insert(0, r);
					cellEditing.startEdit();
				}
			}, {
				itemId: 'removeItem',
				text: 'Удалить запись',
				handler: function() {
					var sm = menuTreePanel.getSelectionModel();
					cellEditing.cancelEdit();
					menuTreeStore.remove(sm.getSelection());
					if (menuTreeStore.getCount() > 0) {
						sm.select(0);
					}
				},
				disabled: true
			}],
			bbar: [{
				xtype	: "button",
				text    : 'Сохранить записи',
				scale	: 'small',
				handler : function() {
					menuTreeStore.proxy.extraParams={};
					menuTreeStore.sync();
				}
			}],
			listeners: {
				'selectionchange': function(view, records) {
					var disabled=!records.length;
					menuTreePanel.down('#removeItem').setDisabled(disabled);
				}
			}
		});
		
		mainContainer.add(menuTreePanel);
		
		mainContainer.setLoading(true);
		mainItemsStore.load(function(records, operation, success) {
			finishMainItems=true;
			mainItemsCombo.select(records[0]);
			if (finishItems){
				mainContainer.setLoading(false);
				filterData();
			}
		});
		itemsStore.load(function(records, operation, success) {
			finishItems=true;
			if (finishMainItems){
				mainContainer.setLoading(false);
				filterData();
			}
		});
	}
});