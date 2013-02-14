Ext.define('app.view.AutoTransport.Recept.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.receptTab',
	
	requires: [
		'app.view.Lib.DateIntervalFilter',
		'app.view.Lib.Grid.Panel'
	],
	
	layout: {
		type: 'border'
	},
	
	title: 'Расход',
	
	items: [
		{
			xtype: 'dateIntervalFilter',
			suffix: 'Recept',
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
			title: 'Расход',
			disableSave: true,
			disableDelete: true,
			disableRefresh: true,
			suffix: 'Recept',
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
					width: 240,
					header: 'Машина',
					dataIndex: 'truck'
				}
			],
			region: 'center',
			split: true,
			flex: 1
		},
		{
			xtype: 'simpleGrid',
			suffix: 'RecGoods',
		    disabled: true,
		    disableSave: true,
		    disableDelete: true,
			disabled: true,
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
						minValue: 0.0001
					}
				},
				{
					width: 120,
					header: 'Единица измерения',
					dataIndex: 'measure'
				}
			],
			features: [{
				ftype: 'summary'
			}],
			region: 'south',
			flex: 1
		}
	]
});