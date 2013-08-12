Ext.define('app.view.BuyersRoute.Container', {
    extend: 'Ext.panel.Panel',
	
	requires: [
		'app.view.BuyersRoute.Filter',
		'app.view.BuyersRoute.Grid'
	],
	
	renderTo: 'buyers_route_js',
	width: '100%',
	height: Ext.getBody().getViewSize().height - 120,
	resizable: true,
	
	layout: {
		type: 'border'
	},
	
	items: [
		{
			xtype: 'buyersRouteFilter',
			region: 'north'
		},
		{
			xtype: 'buyersRouteGrid',
			region: 'west',
			width: 290,
			split: true
		},
		{
			region: 'center',
			height: '100%',
			items:[{
				width: '100%',
				height: '100%',
				xtype: 'container',
				id: 'buyersRouteMap'				
			}]
		}
	]
});