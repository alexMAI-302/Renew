Ext.define('app.view.RenewPlan.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.compPanel',
	
	requires: [
		'app.view.Lib.Grid.Panel',
		'app.view.Lib.DateIntervalFilter',
		'app.view.RenewPlan.Action'
	],
	
	renderTo: 'renew_plan_js',
	width: '100%',
	height: 600,
	
	layout: {
		type: 'border'
	},
	
	items: [
		{
			xtype: 'dateIntervalFilter',
			suffix: 'RenewPlan',
			shiftBegin: 1,
			shiftEnd: 4,
			region: 'north'
		},
		{
			xtype: 'simpleGrid',
			suffix: 'RenewPlan',
			disableSave: true,
			disableRefresh: true,
			disableDelete: true,
			title: 'Планируемые поставки',
			editing: 'row',
			columns: [
				{
					xtype: 'datecolumn',
					width: 100,
					header: 'Дата отпр.',
					dataIndex: 'send_ddate',
					format: 'd.m.Y',
					field: {
						xtype: 'datefield'
					}
				},
				{
					xtype: 'datecolumn',
					width: 100,
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
					width: 100,
					header: 'Откуда',
					dataIndex: 'site_from'
				},
				{
					width: 100,
					header: 'Куда',
					dataIndex: 'site_to'
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
					width:75,
					header: 'План',
					dataIndex: 'renew_plan_type_id',
					useNull: true,
					disabled: true
				},
				{
					width: 150,
					header: 'Номер заказа',
					dataIndex: 'sorder',
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
					header: 'Н',
					disabled: true
				},
				{
					width: 120,
					header: 'Склад<br/>площадки-приемника',
					dataIndex: 'site_to_storage',
					disabled: true
				},
				{
					width: 55,
					header: 'Своб.<br/>на площ.',
					dataIndex: 'sitevol',
					disabled: true
				},
				{
					header: 'Id',
					dataIndex: 'id',
					disabled: true
				}
			],
			region: 'center',
			flex: 1
		},
		{
			xtype: 'renewPlanAction',
			region: 'east'
		}
	]
});