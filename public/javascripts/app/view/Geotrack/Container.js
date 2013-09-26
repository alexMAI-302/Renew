Ext.define('app.view.Geotrack.Container', {
    extend: 'Ext.panel.Panel',
	
	requires: [
		'app.view.Geotrack.Filter',
		'app.view.Geotrack.Grid',
		'app.view.Geotrack.ItemsGrid'
	],
	
	renderTo: 'geotrack_js',
	width: '100%',
	height: Ext.getBody().getViewSize().height - 120,
	resizable: true,
	
	layout: {
		type: 'border'
	},
	
	items: [
		{
			xtype: 'geotrackFilter',
			region: 'west',
			split: true,
			height: '100%',
			width: 300,
			layout: {
				type: 'border'
			},
			items: [
				{
					region: 'north',
					xtype: 'geotrackFilter'
				},
				{
					region: 'center',
					layout: {
						type: 'border'
					},
					items: [
						{
							region: 'north',
							split: true,
							xtype: 'geotrackGrid'
						},
						{
							region: 'center',
							flex: 1,
							xtype: 'geotrackItemsGrid'
						}
					]
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
				id: 'geotrackMap'				
			}]
		}
	]
});