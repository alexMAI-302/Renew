Ext.define('app.view.TermDelivery.MakeAutoTechSetup.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.sellersTab',
	
	requires: [
		'app.view.TermDelivery.MakeAutoTechSetup.Grid',
		'app.view.TermDelivery.MakeAutoTechSetup.Settings'
	],
	
	layout: {
		type: 'border'
	},
	
	renderTo: 'term_delivery_auto_tech_js',
	
	height: 600,
	
	items: [
		{
			xtype: 'settingsPanel',
			region: 'north'
		},
		{
			xtype: 'simpleGrid',
			suffix: 'Zones',
			title: 'Зоны',
			disableDelete: true,
			disableRefresh: true,
			disableAdd: true,
			disableDeleteColumn: true,
			columns: [
				{
					width: 150,
					header: 'Зона',
					dataIndex: 'name'
				},
				{
					width: 25,
					dataIndex: 'selected',
					xtype: 'checkcolumn'
				}
			],
			region: 'center'
		}
	]
});