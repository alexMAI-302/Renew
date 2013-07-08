Ext.define('app.view.Dov.Issue.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.issueTab',
	
	requires: [
		'app.view.Lib.Grid.Panel',
		'app.view.Dov.Issue.Form'
	],
	
	layout: {
		type: 'border'
	},
	
	title: 'Выдача доверенностей',
	items: [
		{
			xtype: 'dovIssueForm',
			region: 'north'
		},
		{
			region: 'center',
			xtype: 'simpleGrid',
			suffix: 'DovIssue',
			disableRefresh: true,
			disableSave: true,
			disableAdd: true,
			disableDelete: true,
			disableDeleteColumn: true,
			title: 'Выданные торговому представителю доверенности за сегодня',
			store: 'Dov.Issue.Dov',
			columns: [
				{
					width: 350,
					header: 'Номер',
					dataIndex: 'ndoc'
				},
				{
					width: 65,
					xtype: 'checkcolumn',
					header: 'На печать',
					dataIndex: 'to_print'
				}
			]
		}
	]
});