Ext.define('app.view.TermDelivery.Monitor.Container', {
    extend: 'Ext.container.Container',
	
	requires: [
		'app.view.TermDelivery.Monitor.Filter',
		'app.view.TermDelivery.Monitor.ItemsGrid',
		'app.view.TermDelivery.Monitor.Grid'
	],

    layout: {
		type: 'fit'
	},
	
	height: Ext.getBody().getViewSize().height - 120,
	renderTo: 'term_delivery_monitor_js',
	
	items: [
		{
			xtype: 'panel',
			layout: {
				type: 'border'
			},
			items: [
				{
					xtype: 'Filter',
					region: 'north'
				},
				{
					xtype: 'routesGrid',
					region: 'west',
					split: true
				},
				{
					xtype: 'terminalsGrid',
					region: 'center'
				}
			]
		}
    ]
});