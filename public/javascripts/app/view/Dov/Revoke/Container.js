Ext.define('app.view.Dov.Revoke.Container', {
    extend: 'Ext.container.Container',
	alias: 'widget.revokeTab',
	
	requires: [
		'app.view.Dov.Revoke.Filter'
	],
	
	title: 'Возврат доверенностей',
	items: [
		{
			xtype: 'dovRevokeFilter'
		},
		{
			xtype: 'simpleGrid',
			suffix: 'DovRevoke',
			disableSave: true,
			disableAdd: true,
			disableDelete: true,
			disableDeleteColumn: true,
			disableRefresh: true,
			title: 'Доверенности',
			height: 400,
			columns: [
				{
					width: 200,
					header: 'Торговый представитель',
					dataIndex: 'salesman_name'
				},
				{
					width: 150,
					header: 'Номер',
					dataIndex: 'ndoc'
				},
				{
					width: 100,
					header: 'Дата',
					dataIndex: 'ddate',
					xtype: 'datecolumn',
					format: 'Y-m-d'
				},
				{
					xtype: 'actioncolumn',
					width: 60,
					header: 'Возврат',
					align: 'center',
					dataIndex: 'status',
					icon: '/images/empty-16.png'
				},
				{
					xtype: 'actioncolumn',
					width: 100,
					header: 'Не использовано',
					align: 'center',
					dataIndex: 'unused',
					icon: '/images/empty-16.png'
				},
				{
					width: 300,
					dataIndex: 'message'
				}
			]
		}
	]
});