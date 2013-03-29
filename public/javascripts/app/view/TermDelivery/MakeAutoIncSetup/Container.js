Ext.define('app.view.TermDelivery.MakeAutoIncSetup.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.incTab',
	
	requires: [
		'app.view.TermDelivery.MakeAutoIncSetup.GridNormes',
		'app.view.TermDelivery.MakeAutoIncSetup.GridWorkdays'
	],
	
	renderTo: 'term_delivery_auto_inc_js',
	height: 700,
	
	items: [
		{
			xtype: 'normesGrid'
		},
		{
			xtype: 'workdaysGrid'
		}
	]
});