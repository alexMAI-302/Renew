//таблица
Ext.define('app.view.TermDelivery.MakeAutoIncSetup.GridNormes', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.normesGrid',
	
	requires: [
		'app.view.Lib.Grid.column.ComboColumn',
		'app.view.Lib.DateIntervalFilter'
	],
    
    config: {
		suffix: 'Normes',
		store: 'TermDelivery.MakeAutoIncSetup.PpsZoneNormes',
		title: 'Нормативы',
		height: 300,
		disableRefresh: true,
		disableDelete: true,
		beforeButtons: [
			{
				xtype: 'dateIntervalFilter',
				suffix: 'Normes',
				shiftInterval: Ext.Date.MONTH,
				shiftBegin: -1
			}
		],
		columns: [
			{
				width: 150,
				header: 'Зона',
				dataIndex: 'zone',
				xtype: 'combocolumn',
				store: 'app.store.TermDelivery.MakeAutoIncSetup.Zones'
			},
			{
				width: 70,
				header: 'Период',
				dataIndex: 'period',
				xtype: 'combocolumn',
				store: 'app.store.TermDelivery.MakeAutoIncSetup.Periods'
			},
			{
				width: 60,
				xtype: 'numbercolumn',
				header: 'Рабочие',
				dataIndex: 'wdvalue',
				format: '0',
				field: {
					xtype: 'numberfield',
					allowDecimal: false
				}
			},
			{
				width: 60,
				xtype: 'numbercolumn',
				header: 'Суббота',
				dataIndex: 'satvalue',
				format: '0',
				field: {
					xtype: 'numberfield',
					allowDecimal: false
				}
			},
			{
				width: 75,
				xtype: 'numbercolumn',
				header: 'Воскресение',
				dataIndex: 'sunvalue',
				format: '0',
				field: {
					xtype: 'numberfield',
					allowDecimal: false
				}
			}
		]
    }
});