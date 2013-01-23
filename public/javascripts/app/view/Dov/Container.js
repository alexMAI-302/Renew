Ext.define('app.view.Dov.Container', {
    extend: 'Ext.container.Container',
	alias: 'widget.compPanel',
	
	requires: [
		'app.view.Lib.Grid.Panel',
		'app.view.Dov.Form'
	],
	
	renderTo: 'dov_js',
	
	items: [
		{
			xtype: 'dovForm'
		},
		{
			xtype: 'simpleGrid',
			suffix: 'Dov',
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