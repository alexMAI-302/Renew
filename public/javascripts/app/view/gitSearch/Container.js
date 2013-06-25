Ext.define('app.view.gitSearch.Container', {
    extend: 'Ext.panel.Panel',
	
	requires: [
		'app.view.gitSearch.Grid',
		'app.view.gitSearch.Filter'
	],
	
	width: '100%',
	height: Ext.getBody().getViewSize().height - 120,
	renderTo: 'main_js',
	
	layout: {
		type: 'border'
	},
	
	items: [
		{
			xtype: 'gitSearchFilter',
			region: 'north'
		},
		{
			xtype: 'gitSearchGrid',
			region: 'center'
		},
	]
});