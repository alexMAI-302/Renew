Ext.define('app.view.Certificate.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.certificatePanel',
	
	requires: [
		'app.view.Certificate.Filter',
		'app.view.Certificate.Grid'
	],
	
	layout: {
		type: 'anchor'
	},
	
	renderTo: 'certificate_js',
	
	items: [
		{
			xtype: 'certificateFilter',
			region: 'north'
		},
		{
			margin: '5, 0, 0, 0',
			xtype: 'certificateGrid',
			region: 'center',
			hidden: true
		}
	]
});