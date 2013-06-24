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
	border: false,
	defaults: {
		border: false
	},
	
	renderTo: 'certificate_js',
	
	items: [
		{
			items:[
				{
					xtype: 'certificateFilter'
				}
			],
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