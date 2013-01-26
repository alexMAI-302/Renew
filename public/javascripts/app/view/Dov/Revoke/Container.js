Ext.define('app.view.Dov.Revoke.Container', {
    extend: 'Ext.container.Container',
	alias: 'widget.revokeTab',
	
	requires: [
		'app.view.Dov.Revoke.Filter'
	],
	
	items: [
		{
			xtype: 'dovRevokeFilter'
		},
		{
			xtype: 'panel',
			id: 'DovRevokeTable',
			title: 'Выданные торговому представителю доверенности за сегодня',
			columns: [
				{
					width: 350,
					header: 'Торговый представитель',
					dataIndex: 'salesman_name'
				},
				{
					width: 350,
					header: 'Номер',
					dataIndex: 'ndoc'
				},
				{
					width: 350,
					header: 'Дата',
					dataIndex: 'ddate'
				},
				{
					xtype: 'actioncolumn',
					width: 40,
					header: 'Возврат',
					align: 'center',
					dataIndex: 'status'
				},
				{
					xtype: 'actioncolumn',
					width: 25,
					header: 'Не использовано',
					align: 'center',
					dataIndex: 'unused'
				},
				{
					width: 300,
					dataIndex: 'message'
				}
			],
			height: 400
		}
	]
});