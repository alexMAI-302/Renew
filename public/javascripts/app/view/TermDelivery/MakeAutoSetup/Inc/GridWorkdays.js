//таблица
Ext.define('app.view.TermDelivery.MakeAutoSetup.Inc.GridWorkdays', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.workdaysGrid',
	
	requires: [
		'app.view.Lib.DateIntervalFilter'
	],
    
    config: {
		suffix: 'Workdays',
		title: 'Типы дней для посещения',
		height: 300,
		disableRefresh: true,
		disableDelete: true,
		beforeButtons: [
			{
				xtype: 'dateIntervalFilter',
				suffix: 'Workdays',
				shiftInterval: Ext.Date.MONTH,
				shiftBegin: -1
			}
		],
		columns: [
			{
				width: 120,
				header: 'Дата',
				dataIndex: 'ddate',
				xtype: 'datecolumn',
				format: 'Y-m-d',
				field: {
					xtype: 'datefield',
					format: 'Y-m-d'
				}
			},
			{
				width: 110,
				header: 'Тип',
				dataIndex: 'type',
				field: {
					xtype: 'combo',
					displayField: 'name',
					valueField: 'id'
				}
			}
		]
    }
});