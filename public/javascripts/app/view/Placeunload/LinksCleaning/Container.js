Ext.define('app.view.Placeunload.LinksCleaning.Container', {
    extend: 'Ext.panel.Panel',
	
	requires: [
		'app.view.Lib.DateIntervalFilter',
		'app.view.Placeunload.LinksCleaning.Grid',
		'app.view.Placeunload.LinksCleaning.ItemsGrid'
	],
	
	layout: {
		type: 'border'
	},
	
	height: Ext.getBody().getViewSize().height - 120,
	renderTo: 'placeunload_links_cleaning_js',
	
	items: [
		{
			region: 'west',
			width: 600,
			layout: 'border',
			items: [
				{
					xtype: 'placeunloadsGrid',
					region: 'south',
					flex: 1
				},
				{
					xtype: 'buyersGrid',
					region: 'center',
					split: true,
					flex: 1
				}
			]
		},
		{
			region: 'center',
			height: '100%',
			items:[{
				width: '100%',
				height: '100%',
				xtype: 'container',
				id: 'placeunloadLinksCleaningMap'				
			}]
		}
	]
});