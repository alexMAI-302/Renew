Ext.define('app.view.Geotrack.Container', {
    extend: 'Ext.panel.Panel',
	
	requires: [
		'app.view.Geotrack.Filter'
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
			split: true
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