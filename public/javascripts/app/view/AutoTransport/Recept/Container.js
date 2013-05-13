Ext.define('app.view.AutoTransport.Recept.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.receptTab',
	
	requires: [
		'app.view.Lib.DateIntervalFilter',
		'app.view.AutoTransport.Recept.Grid',
		'app.view.AutoTransport.Recept.ItemsGrid'
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
					xtype: 'button',
					tooltip: 'Сохранить'
				}
			],
			region: 'north'
		},
		{
			xtype: 'receptGrid',
			region: 'center',
			split: true,
			flex: 1
		},
		{
			xtype: 'recGoodsGrid',
			region: 'south',
			flex: 1
		}
	]
});