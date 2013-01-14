Ext.define('app.view.TermDelivery.MakeAutoSetup.Inc.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.incomeTab',
	
	requires: [
		'app.view.TermDelivery.MakeAutoSetup.Inc.Filter',
		'app.view.TermDelivery.MakeAutoSetup.Inc.ItemsGrid',
		'app.view.TermDelivery.MakeAutoSetup.Inc.Grid'
	],
	
	layout: {
		type: 'vbox'
	},
	
	title: 'Настройка зон инкассаторов',
	
	items: [
		{
			layout: {
				type: 'border'
			},
			items: [
				{
					xtype: 'Filter',
					region: 'north'
				},
				{
					xtype: 'Grid',
					region: 'center'
				}
			]
		},
		{
			layout: {
				type: 'border'
			},
			items: [
				{
					xtype: 'Filter',
					region: 'north'
				},
				{
					xtype: 'Grid',
					region: 'center'
				}
			]
		}
	]
});