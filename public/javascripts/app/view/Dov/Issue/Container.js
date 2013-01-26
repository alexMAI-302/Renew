Ext.define('app.view.Dov.Issue.Container', {
    extend: 'Ext.container.Container',
	alias: 'widget.issueTab',
	
	requires: [
		'app.view.Lib.Grid.Panel',
		'app.view.Dov.Issue.Form'
	],
	
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
			columns: [
				{
					width: 350,
					header: 'Номер',
					dataIndex: 'id'
				}
			],
			height: 400
		}
	]
});