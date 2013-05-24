Ext.define('app.view.gitSearch.Container', {
    extend: 'Ext.panel.Panel',
	
	requires: [
		'app.view.gitSearch.Grid',
		'app.view.gitSearch.Filter',
	],
	
	width: '100%',
	height: 400,
	
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