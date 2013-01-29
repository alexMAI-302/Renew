Ext.define('app.view.Dov.Issue.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.issueTab',
	
	requires: [
		'app.view.Lib.Grid.Panel',
		'app.view.Dov.Issue.Form'
	],
	
	title: 'Выдача доверенностей',
	items: [
		{
			xtype: 'dovIssueForm'
		},
		{
			xtype: 'simpleGrid',
			suffix: 'DovIssue',
			disableSave: true,
			disableAdd: true,
			disableDelete: true,
			disableDeleteColumn: true,
			title: 'Выданные торговому представителю доверенности за сегодня',
			hright: 400,
			columns: [
				{
					width: 350,
					header: 'Номер',
					dataIndex: 'id'
				}
			]
		}
	]
});