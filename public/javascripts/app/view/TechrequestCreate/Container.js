Ext.define('app.view.TechrequestCreate.Container', {
    extend: 'app.view.Lib.Grid.Panel',
	renderTo: 'techrequest_create_js',
	height: Ext.getBody().getViewSize().height - 120,
	requires: [
		'app.view.TechrequestCreate.Filter'
	],
	
	config: {
		suffix: 'TechrequestCreate',
		store: 'TechrequestCreate.TechrequestCreateEntries',
		disableRefresh: true,
		disableAdd: true,
		disableDelete: true,
		disableSave: true,
		disableDeleteColumn: true,
		beforeButtons: [
			{
				xtype: 'filterTechrequestCreate'
			}
		],
		enableBuffering: true,
		title: 'Задания техникам',
		columnLines: true,
		selModel: {
            mode: "MULTI"
        },
        selType: 'checkboxmodel',
		columns: [
			{
				width: 120,
				header: 'Код терминала',
				dataIndex: 'code'
			},
			{
				width: 600,
				header: 'Терминал',
				dataIndex: 'name'
			},
			{
				width: 600,
				header: 'Зоны',
				dataIndex: 'zones'
			}
		]
	}
});