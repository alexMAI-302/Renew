Ext.define('app.view.Comp.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.compPanel',
	
	requires: [
		'app.view.Comp.Filter',
		'app.view.Comp.ItemsGrid',
		'app.view.Comp.Grid',
		'app.view.Comp.Action',
	],
	
	layout: {
		type: 'border'
	},
	
	renderTo: 'comp_js',
	height: 600,
	resizable: true,
	
	items: [
		{
			xtype: 'compFilter',
			region: 'north'
		},
		{
			xtype: 'compGrid',
			region: 'center',
			flex: 1
		},
		{
			xtype: 'operationsGrid',
			region: 'south',
			flex: 1,
			split: true
		},
		{
			xtype: 'compAction',
			region: 'east'
		}
	]
});