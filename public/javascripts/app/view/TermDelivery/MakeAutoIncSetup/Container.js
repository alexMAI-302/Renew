Ext.define('app.view.TermDelivery.MakeAutoIncSetup.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.incTab',
	
	requires: [
		'app.view.TermDelivery.MakeAutoIncSetup.GridNormes',
		'app.view.TermDelivery.MakeAutoIncSetup.GridWorkdays'
	],
	
	renderTo: 'term_delivery_auto_inc_js',
	height: Ext.getBody().getViewSize().height - 120,
	
	items: [
		{
			xtype: 'normesGrid'
		},
		{
			xtype: 'workdaysGrid'
		}
	]
});