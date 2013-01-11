Ext.define('app.view.TermDelivery.MakeAutoSetup.Common.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.commonTab',
	
	requires: [
		'app.view.TermDelivery.MakeAutoSetup.Common.Filter',
		'app.view.TermDelivery.MakeAutoSetup.Common.Grid'
	],
	
	layout: {
		type: 'border'
	},
	
	title: 'Общая настройка',
	
	items: [
		{
			xtype: 'terminalsFilter',
			region: 'north'
		},
		{
			xtype: 'terminalsGrid',
			region: 'center'
		}
	]
});