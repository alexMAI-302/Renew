Ext.define('app.view.RenewPlan.GroupInfo', {
	extend: 'Ext.container.Container',
	alias: 'widget.renewPlanGroupInfo',
	
	height: 85,
	items: [
		{
			xtype: 'grid',
			id: 'RenewPlanGoodsInfoTable',
			columns: [
				{
					dataIndex: 'name',
					menuDisabled: true,
					sortable: false
				},
				{
					xtype: 'numbercolumn',
					format: '0.00',
					dataIndex: 'volume',
					header: 'Объем по маш.',
					menuDisabled: true,
					sortable: false
				},
				{
					xtype: 'numbercolumn',
					format: '0.00',
					dataIndex: 'pans',
					header: 'Под. по маш.',
					menuDisabled: true,
					sortable: false
				},
				{
					xtype: 'numbercolumn',
					format: '0.00',
					dataIndex: 'weight',
					header: 'Вес по маш.',
					menuDisabled: true,
					sortable: false
				},
				{
					xtype: 'numbercolumn',
					format: '0.00',
					dataIndex: 'siteRemains',
					header: 'Ост. площ.',
					menuDisabled: true,
					sortable: false
				},
				{
					xtype: 'numbercolumn',
					format: '0.00',
					dataIndex: 'truckRemains',
					header: 'Ост. маш.',
					menuDisabled: true,
					sortable: false
				},
				{
					dataIndex: 'positions',
					header: 'Позиций',
					menuDisabled: true,
					sortable: false
				},
				{
					xtype: 'numbercolumn',
					format: '0.00',
					dataIndex: 'donevol',
					header: 'Коробов',
					menuDisabled: true,
					sortable: false
				},
				{
					xtype: 'numbercolumn',
					format: '0.00',
					dataIndex: 'pansAll',
					header: 'Поддонов',
					menuDisabled: true,
					sortable: false
				},
				{
					xtype: 'numbercolumn',
					format: '0.00',
					dataIndex: 'weightAll',
					header: 'Масса',
					menuDisabled: true,
					sortable: false
				},
				{
					xtype: 'numbercolumn',
					format: '0.00',
					dataIndex: 'volumeAll',
					header: 'Объем',
					menuDisabled: true,
					sortable: false
				}
			]
		}
	]
});