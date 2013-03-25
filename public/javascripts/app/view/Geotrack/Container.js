Ext.define('app.view.Geotrack.Container', {
    extend: 'Ext.panel.Panel',
	
	requires: [
		'app.view.Geotrack.Filter'
	],
	
	renderTo: 'geotrack_js',
	width: '100%',
	height: 700,
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
			tbar: [
				{
					id : 'refreshGeotrack',
					icon : '/ext/resources/themes/images/default/grid/refresh.gif',
					tooltip: 'Обновить',
					disabled: true
				}
			],
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