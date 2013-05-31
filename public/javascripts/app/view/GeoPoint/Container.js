Ext.define('app.view.GeoPoint.Container', {
    extend: 'Ext.panel.Panel',
	
	requires: [
		'app.view.GeoPoint.Grid',
		'app.view.GeoPoint.Filter'
	],
	
	renderTo: 'geo_point_js',
	width: '100%',
	height: Ext.getBody().getViewSize().height - 120,
	
	layout: {
		type: 'border'
	},
	
	items: [
		{
			xtype: 'geoPointFilter',
			region: 'north'
		},
		{
			xtype: 'geoPointPanel',
			region: 'center'
		},
		{
			region: 'east',
			width: '33%',
			height: '100%',
			split: true,
			collapsible: true,
			items:[{
				width: '100%',
				height: '100%',
				xtype: 'container',
				id: 'geoPointMap'				
			}]
		}
	]
});