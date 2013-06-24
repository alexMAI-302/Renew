//таблица
Ext.define('app.view.TermDelivery.MakeAutoIncSetup.GridWorkdays', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.workdaysGrid',
	
	requires: [
		'app.view.Lib.Grid.column.ComboColumn',
		'app.view.Lib.DateIntervalFilter'
	],
    
    config: {
		suffix: 'Workdays',
		title: 'Типы дней для посещения',
		height: 300,
		disableRefresh: true,
		disableDelete: true,
		store: 'TermDelivery.MakeAutoIncSetup.PpsZoneWorkdays',
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
				xtype: 'combocolumn',
				store: 'app.store.TermDelivery.MakeAutoIncSetup.DayTypes',
				allowNull: true
			}
		]
    }
});