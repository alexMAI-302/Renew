Ext.define('app.view.TermDelivery.MakeAutoTechSetup.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.sellersTab',
	
	requires: [
		'app.view.TermDelivery.MakeAutoTechSetup.Grid',
		'app.view.TermDelivery.MakeAutoTechSetup.Settings'
	],
	
	layout: {
		type: 'border'
	},
	
	renderTo: 'term_delivery_auto_tech_js',
	
	height: 600,
	
	items: [
		{
			xtype: 'settingsPanel',
			region: 'north'
		},
		{
			xtype: 'zonesGrid',
			region: 'center'
		}
	]
});