Ext.define('app.view.TermDeliveryMakeAutoSetup.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.sellersTab',
	
	requires: [
		'app.view.TermDeliveryMakeAutoSetup.Grid',
		'app.view.TermDeliveryMakeAutoSetup.Settings'
	],
	
	layout: {
		type: 'border'
	},
	
	renderTo: 'term_delivery_auto_js',
	
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