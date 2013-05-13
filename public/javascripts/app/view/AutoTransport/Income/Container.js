Ext.define('app.view.AutoTransport.Income.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.incomeTab',
	
	requires: [
		'app.view.Lib.DateIntervalFilter',
		'app.view.AutoTransport.Income.Grid',
		'app.view.AutoTransport.Income.ItemsGrid'
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
					xtype: 'button',
					tooltip: 'Сохранить'
				}
			],
			region: 'north'
		},
		{
			xtype: 'incomeGrid',
			region: 'center',
			split: true,
			flex: 1
		},
		{
			xtype: 'incGoodsGrid',
			region: 'south',
			flex: 1
		}
	]
});