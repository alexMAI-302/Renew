Ext.define('app.view.RenewPlan.Grid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.renewPlanPanel',
	
	requires: [
		'app.view.Lib.DateIntervalFilter',
		'app.view.Lib.Grid.column.ComboColumn'
	],
	
	config: {
		suffix: 'RenewPlan',
		store: 'RenewPlan.RenewPlans',
		disableRefresh: true,
		disableDeleteColumn: true,
		title: 'Планируемые поставки',
		editing: 'row',
		beforeButtons: [
			{
				xtype: 'dateIntervalFilter',
				suffix: 'RenewPlan',
				shiftBegin: 1,
				shiftEnd: 4
			}
		],
		columns: [
			{
				xtype: 'datecolumn',
				width: 85,
				header: 'Дата отпр.',
				dataIndex: 'send_ddate',
				format: 'd.m.Y',
				field: {
					xtype: 'datefield'
				}
			},
			{
				xtype: 'datecolumn',
				width: 85,
				header: 'Дата прихода',
				dataIndex: 'sup_ddate',
				format: 'd.m.Y',
				field: {
					xtype: 'datefield',
					value: Ext.Date.parse(Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d')
				}
			},
			{
				xtype: 'numbercolumn',
				width: 50,
				header: 'Объем<br/>машины',
				dataIndex: 'truckvol',
				field: {
					xtype: 'numberfield',
					minValue: 0
				}
			},
			{
				width: 90,
				header: 'Откуда',
				dataIndex: 'site_from',
				xtype: 'combocolumn',
				store: 'RenewPlan.Sites'
			},
			{
				width: 90,
				header: 'Куда',
				dataIndex: 'site_to',
				xtype: 'combocolumn',
				store: 'RenewPlan.Sites'
			},
			{
				xtype: 'numbercolumn',
				width: 50,
				header: 'К.<br/>пополн.',
				dataIndex: 'k_renew',
				field: {
					xtype: 'numberfield',
					minValue: 0
				}
			},
			{
				xtype: 'numbercolumn',
				width: 50,
				header: 'К.<br/>чувств.',
				dataIndex: 'k_sens',
				field: {
					xtype: 'numberfield',
					minValue: 0
				}
			},
			{
				xtype: 'numbercolumn',
				width: 45,
				header: 'К.<br/>остат.',
				dataIndex: 'k_rem',
				field: {
					xtype: 'numberfield',
					minValue: 0
				}
			},
			{
				width: 40,
				header: 'План',
				dataIndex: 'renew_plan_type_id',
				xtype: 'combocolumn',
				store: 'RenewPlan.RenewPlanTypes',
				onlyRenderer: true,
				allowNull: true,
				disabled: true
			},
			{
				width: 150,
				header: 'Номер заказа',
				dataIndex: 'sorder_ndoc',
				disabled: true
			},
			{
				width: 70,
				header: 'Вес',
				dataIndex: 'weight',
				disabled: true,
				xtype: 'numbercolumn',
				format: '0.00'
			},
			{
				width: 50,
				header: 'Объем',
				dataIndex: 'volume',
				disabled: true,
				xtype: 'numbercolumn',
				format: '0.00'
			},
			{
				xtype: 'checkcolumn',
				width: 25,
				dataIndex: 'sorder_status1',
				header: 'Н',
				disabled: true
			},
			{
				width: 90,
				header: 'Склад<br/>приемника',
				dataIndex: 'site_to_storage',
				xtype: 'combocolumn',
				store: 'RenewPlan.SiteToStorages',
				allowNull: true,
				onlyRenderer: true,
				disabled: true
			},
			{
				width: 55,
				header: 'Своб.<br/>на площ.',
				dataIndex: 'sitevol',
				disabled: true
			},
			{
				header: 'Номер план.<br/>поставки',
				dataIndex: 'id',
				disabled: true
			}
		]
	}
});