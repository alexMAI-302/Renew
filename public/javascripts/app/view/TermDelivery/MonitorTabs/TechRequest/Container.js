Ext.define('app.view.TermDelivery.MonitorTabs.TechRequest.Container', {
    extend: 'app.view.Lib.Grid.Panel',
	//renderTo: 'term_delivery_monitor_js',
	height: Ext.getBody().getViewSize().height - 120,
	requires: [
		'app.view.TermDelivery.MonitorTabs.TechRequest.Filter'
	],
	
	config: {
		suffix: 'TechRequest',
		store: 'TermDelivery.MonitorTabs.TechRequest.TechRequestData',
		disableAdd: true,
		disableDelete: true,
		enableBuffering: true,
		title: 'Задания техникам',
		columnLines: true,
		beforeButtons: [
			{
				xtype: 'filterTechRequest'
			}
		],
		columns: [
			{
				width: 600,
				header: 'Терминал',
				dataIndex: 'terminal_name'
			},
			{
				width: 120,
				header: 'Тип задания',
				dataIndex: 'techrequest_type_name'
			},
			{
				width: 120,
				header: 'Статус',
				xtype: 'checkcolumn',
				dataIndex: 'status'
			},
			{
				width: 600,
				header: 'Комментарий',
				dataIndex: 'comments',
				flex: 1,
				editor: {
					xtype: 'textfield',
					allowBlank: true
				}
			}
		]
	}
});