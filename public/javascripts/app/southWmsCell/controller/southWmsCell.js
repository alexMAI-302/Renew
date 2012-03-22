Ext.define('southWmsCell.controller.southWmsCell', {
    extend: 'Ext.app.Controller',
	models: [
		'southWmsCell.model.wmscellModel',
		'southWmsCell.model.valueModel'],
    init: function() {
	
		var user_id, user_name;
		
		function showServerError(response, options) {
			Ext.Msg.alert('Ошибка', response.responseText);
			mainContainer.setLoading(false);
		}
		
		Ext.Ajax.request.failure = showServerError;
		
		var cellsStore = Ext.create('Ext.data.Store', {
			model: 'southWmsCell.model.wmscellModel',
			proxy: {
				type: 'rest',
				url : '/southwms_cells/wms_cells',
				batchUpdateMode: 'complete',
				reader: {
					type: 'json'
				},
				writer: {
					type: 'json'
				}
			}
		});
		
		var rowsStore = Ext.create('Ext.data.Store', {
			model: 'southWmsCell.model.valueModel',
			proxy: {
				type: 'ajax',
				url : '/southwms_cells/wms_rows',
				reader: {
					type: 'json'
				}
			},
			autoLoad: true
		});
		
		var tiersStore = Ext.create('Ext.data.Store', {
			model: 'southWmsCell.model.valueModel',
			proxy: {
				type: 'ajax',
				url : '/southwms_cells/wms_tiers',
				reader: {
					type: 'json'
				}
			},
			autoLoad: true
		});
		
		var typesStore = Ext.create('Ext.data.Store', {
			model: 'southWmsCell.model.valueModel'
		});
		
		var types=[
			Ext.ModelManager.create({
						id: 0,
						name: "Сток"
					}, 'southWmsCell.model.valueModel'),
			Ext.ModelManager.create({
						id: 1,
						name: "Пикинг"
					}, 'southWmsCell.model.valueModel')];
		typesStore.insert(0, types);
		
		var mainContainer=Ext.create('Ext.container.Container', {
			width: 600,
			layout: {
				type: 'anchor'
			},
			renderTo: Ext.get('south_wms_js'),
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
		
		var rowsCombo=Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Ряд',
			store: rowsStore,
			displayField: 'name',
			valueField: 'id',
			queryMode: 'local',
			autoSelect: true,
			width: 200,
			listeners: {
				"change": function(field, newValue, oldValue, options){
					tiersStore.proxy.extraParams={
						row: rowsCombo.value
					};
					tiersStore.load();
				}
			}
		});
		
		var tiersCombo=Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Ярус',
			store: tiersStore,
			displayField: 'name',
			valueField: 'id',
			queryMode: 'local',
			autoSelect: true,
			width: 200
		});
		
		function loadCells(){
			if(rowsCombo.value>0 || tiersCombo.value>0){
				cellsContainer.setLoading(true);
				cellsStore.proxy.extraParams={
					row: rowsCombo.value,
					tier: tiersCombo.value
				};
				cellsStore.load(function(records, operation, success) {
					if(success==true){
						cellsContainer.setLoading(false);
					} else {
						Ext.Msg.alert('Ошибка', 'Ошибка при загрузке адресов ячеек');
					}
				});
			} else {
				Ext.Msg.alert('Ошибка', 'Выберите хотя бы одно значение в фильтре');
			}
		};
		
		var filterCells=Ext.create('Ext.Button', {
			text    : 'Фильтр',
			handler : loadCells
		});
		
		filterPanel.add(rowsCombo);
		filterPanel.add(tiersCombo);
		filterPanel.add(filterCells);
		mainContainer.add(filterPanel);
		
		var cellsContainer = Ext.create('Ext.container.Container', {
			width: 600,
			layout: {
				type: 'anchor'
			},
			defaults: {
				style: {
					margin: '10px'
				}
			},
			margin: '-0px'
		});
		
		var cellEditingCells = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});
		
		var gridId='southWmsTable';
		var cellsPanel=Ext.create('Ext.grid.Panel', {
			id: gridId,
			title: 'Адреса ячеек',
			store: cellsStore,
			columns: [
				// {
					// header: 'Идентификатор',
					// dataIndex: 'id',
					// hidden: true,
					// disabled: true
				// },
				{
					width: 100,
					header: 'Ряд',
					dataIndex: 'row',
					field: Ext.create('Ext.form.ComboBox', {
						store: rowsStore,
						displayField: 'name',
						valueField: 'name',
						allowBlank: false,
						queryMode: 'local',
						listeners:{
							"focus": function (obj, options){
								obj.expand();
							}
						}
					})
				},
				{
					width: 100,
					header: 'Ячейка',
					dataIndex: 'cell',
					field: {
						xtype: 'numberfield',
						maxValue: 99,
						minValue: 0
					}
				},
				{
					width: 100,
					header: 'Ярус',
					dataIndex: 'tier',
					renderer: function(value){
						var matching = tiersStore.queryBy(
							function(record, id){
								return record.get('id') == value;
							});
						return (matching.items[0]) ? matching.items[0].data.name : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: tiersStore,
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
				},
				{
					width: 100,
					header: 'Дополнительно',
					dataIndex: 'extra',
					field: {
						xtype: 'textfield'
					}
				},
				{
					width: 100,
					header: 'Тип',
					dataIndex: 'type',
					renderer: function(value){
						var matching = typesStore.queryBy(
							function(record, id){
								return record.get('id') == value;
							});
						return (matching.items[0]) ? matching.items[0].data.name : '';
					},
					field: Ext.create('Ext.form.ComboBox', {
						store: typesStore,
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
			selModel: {
				selType: 'rowmodel'
			},
			plugins: [cellEditingCells],
			height: 400,
			tbar: [{
				itemId: 'addCells',
				text: 'Добавить ячейку',
				handler : function() {
					cellEditingCells.cancelEdit();
					
					var r=Ext.ModelManager.create({
						row: rowsCombo.getRawValue(),
						cell: 1,
						tier: tiersCombo.getRawValue(),
						type: 0
					}, 'southWmsCell.model.wmscellModel')
					
					cellsStore.insert(0, r);
				}
			}, {
				itemId: 'removeCells',
				text: 'Удалить ячейку',
				handler: function() {
					var sm = cellsPanel.getSelectionModel();
					cellEditingCells.cancelEdit();
					cellsStore.remove(sm.getSelection());
					if (cellsStore.getCount() > 0) {
						sm.select(0);
					}
				},
				disabled: true
			}],
			bbar: [{
				text	: 'Сохранить адреса ячеек',
				scale	: 'small',
				margin	: '-10 0 0 10',
				handler : function() {
					cellsStore.proxy.extraParams={};
					cellsStore.sync();
				}
			}],
			listeners: {
				'selectionchange': function(view, records) {
					var disabled=!records.length;
					
					cellsPanel.down('#removeCells').setDisabled(disabled);
				}
			}
		});
		
		cellsContainer.add(cellsPanel);
		mainContainer.add(cellsContainer);
	}
});