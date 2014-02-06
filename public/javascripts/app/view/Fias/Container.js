Ext.define('app.view.Fias.Container', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.fiasPanel',

	requires : ['app.view.Fias.Filter', 'app.view.Fias.Detail'],
	renderTo : 'fias_js',
	width: '100%',
	layout: {
		type: 'border'
	},
	height : Ext.getBody().getViewSize().height - 120,

	items : [ 
			{
			xtype: 'fiasFilter',
			region: 'west',
			width: '40%',
			height: '100%'
		},
					{
			xtype: 'fiasDetail',
			region: 'east',
			width: '60%',
			height: '100%'
		}

		]
}); 