Ext.define('app.view.SalesmanRoutes.Container', {
    extend: 'Ext.container.Container',
	
	requires: [
		'app.view.SalesmanRoutes.Filter',
		'app.view.SalesmanRoutes.Grid'
	],

    layout: {
		type: 'fit'
	},
	
	height: 600,
	id: 'mainContainer',
	renderTo: Ext.get('salesman_routes_js'),
	
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
					xtype: 'dataGrid',
					region: 'west',
					split: true
				},
				{
					id: 'salesman_routes_map',
					xtype: 'container',
					region: 'center'
				}
			]
		}
    ]
});