Ext.define('app.view.TermDelivery.MakeAutoCommonSetup.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.commonTab',
	
	requires: [
		'app.view.TermDelivery.MakeAutoCommonSetup.Filter',
		'app.view.TermDelivery.MakeAutoCommonSetup.Grid'
	],
	
	layout: {
		type: 'border'
	},
	
	renderTo: 'term_delivery_auto_common_js',
	height: 700,
	
	items: [
		{
			xtype: 'terminalsFilter',
			region: 'north'
		},
		{
			xtype: 'terminalsGrid',
			region: 'center'
		}
	]
});