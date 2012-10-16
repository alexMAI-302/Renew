Ext.define('app.view.TermDelivery.Container', {
    extend: 'Ext.container.Container',
	
	requires: [
		'app.view.TermDelivery.Filter',
		'app.view.TermDelivery.ItemsGrid',
		'app.view.TermDelivery.Grid'
	],

    layout: {
		type: 'fit'
	},
	
	height: 600,
	id: 'mainContainer',
	renderTo: Ext.get('term_delivery_js'),
	
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