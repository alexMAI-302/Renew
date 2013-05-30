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
	
	height: 700,
	renderTo: 'placeunload_links_cleaning_js',
	
	items: [
		{
			xtype: 'buyersGrid',
			region: 'center',
			split: true,
			flex: 1
		},
		{
			xtype: 'placeunloadsGrid',
			region: 'south',
			flex: 1
		}
	]
});