Ext.define('app.view.SalesmanRoutes.Container', {
    extend: 'Ext.panel.Panel',
	
	requires: [
		'app.view.SalesmanRoutes.Filter',
		'app.view.SalesmanRoutes.Grid'
	],
	
	height: Ext.getBody().getViewSize().height - 120,
	id: 'mainContainer',
	renderTo: Ext.get('salesman_routes_js'),
	
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
			region: 'center',
			height: '100%',
			items:[{
				width: '100%',
				height: '100%',
				id: 'salesman_routes_map',
				xtype: 'container'
			}]
		}
	]
});