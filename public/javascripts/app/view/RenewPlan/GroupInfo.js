Ext.define('app.view.RenewPlan.GroupInfo', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.renewPlanGroupInfo',
	
	height: 91,
	id: 'RenewPlanGoodsInfoTable',
	store: {
		model: 'app.model.RenewPlan.InfoTableModel',
		proxy: {
			type: 'memory'
		}
	},
	columns: [
		{
			dataIndex: 'name',
			menuDisabled: true,
			sortable: false
		},
		{
			xtype: 'numbercolumn',
			format: '0.00',
			dataIndex: 'all',
			header: '',
			menuDisabled: true,
			sortable: false
		},
		{
			xtype: 'numbercolumn',
			format: '0.00',
			dataIndex: 'num1',
			header: '№1',
			menuDisabled: true,
			sortable: false
		},
		{
			xtype: 'numbercolumn',
			format: '0.00',
			dataIndex: 'num2',
			header: '№2',
			menuDisabled: true,
			sortable: false
		},
		{
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
});