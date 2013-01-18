Ext.define('app.view.AutoTransport.Income.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.incomeTab',
	
	requires: [
		'app.view.Lib.DateIntervalFilter',
		'app.view.Lib.Grid.Panel'
	],
	
	layout: {
		type: 'border'
	},
	
	title: 'Приход',
	
	items: [
		{
			xtype: 'dateIntervalFilter',
			suffix: 'Income',
			shiftInterval: Ext.Date.MONTH,
			shiftBegin: -1,
			extraItems: [
				{
					id: 'save',
					icon: '/images/save.png',
					xtype: 'button'
				}
			],
			region: 'north'
		},
		{
			xtype: 'simpleGrid',
			suffix: 'Income',
			title: 'Приход',
			disableSave: true,
			disableDelete: true,
			disableRefresh: true,
			columns: [
				{
					width: 120,
					header: 'Дата',
					dataIndex: 'ddate',
					xtype: 'datecolumn',
					format: 'd.m.Y H:i',
					field: {
						xtype: 'datefield',
						format: 'd.m.Y H:i',
						value: Ext.Date.parse(Ext.Date.format(new Date(), 'd.m.Y H:i'), 'd.m.Y H:i')
					}
				},
				{
					width: 70,
					header: 'Тип',
					dataIndex: 'type',
					field: {
						xtype: 'combo',
						displayField: 'name',
						valueField: 'id'
					}
				},
				{
					width: 170,
					header: 'Поставщик',
					dataIndex: 'at_seller'
				},
				{
					width: 70,
					xtype: 'numbercolumn',
					format: '0,00',
					header: 'Сумма',
					dataIndex: 'sum'
				}
			],
			region: 'center',
			split: true,
			flex: 1
		},
		{
			xtype: 'simpleGrid',
			suffix: 'IncGoods',
		    disabled: true,
		    disableSave: true,
		    disableDelete: true,
			columns: [
				{
					width: 170,
					header: 'Группа',
					dataIndex: 'at_ggroup'
				},
				{
					width: 400,
					header: 'Наименование',
					dataIndex: 'at_goods'
				},
				{
					width: 80,
					header: 'Количество',
					dataIndex: 'vol',
					field: {
						xtype: 'numberfield',
						minValue: 1
					}
				},
				{
					width: 120,
					header: 'Единица измерения',
					dataIndex: 'measure'
				},
				{
					width: 80,
					header: 'Цена',
					dataIndex: 'price',
					field: {
						xtype: 'numberfield',
						minValue: 0
					}
				},
				{
					width: 80,
					header: 'Сумма',
					dataIndex: 'sum',
					summaryType: 'sum'
				}
			],
			plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1,
				pluginId: 'cellEditingIncomeGoods',
				listeners:{
					edit: function(editor, e){
						var r=e.record;
						r.set('sum', r.get('vol')*r.get('price'));
						e.grid.view.refresh();
						e.grid.view.saveScrollState();
						e.grid.view.refresh();
						e.grid.view.restoreScrollState();
						return true;
					}
				}
			})],
			features: [{
				ftype: 'summary'
			}],
			region: 'south',
			flex: 1
		}
	]
});