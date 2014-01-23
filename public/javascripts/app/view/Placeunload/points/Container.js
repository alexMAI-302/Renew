Ext.define('app.view.Placeunload.points.Container', {
    extend: 'Ext.panel.Panel',
	
	requires: [
		'app.view.Placeunload.points.Grid',
		'app.view.Placeunload.points.Filter'
	],
	
	renderTo: 'placeunload_points_js',
	width: '100%',
	height: Ext.getBody().getViewSize().height - 120,
	resizable: true,
	
	layout: {
		type: 'border'
	},
	
	items: [
		{
			region: 'west',
			width: 1050,
			split: true,
			layout: 'border',
			xtype: 'placeunloadsGrid'
		},
		{
			region: 'north',
			xtype: 'placeunloadFilter'
		},
		{
			region: 'center',
			width: '100%',
			height: '100%',
			xtype: 'component',
			autoEl:{
				tag: 'div'
			},
			id: 'placeunloadPointsMap'
		}
	]
});