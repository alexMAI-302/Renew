Ext.define('app.view.AutoTransport.Income.Grid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.incomeGrid',
	requires: 'app.view.Lib.Grid.column.ComboColumn',
	
	config: {
		store: 'AutoTransport.Income.Income',
		suffix: 'Income',
		title: 'Приход',
		disableSave: true,
		disableDeleteColumn: true,
		disableRefresh: true,
		columns: [
			{
				width: 120,
				header: 'Дата',
				dataIndex: 'ddate',
				xtype: 'datecolumn',
				format: 'd.m.Y H:i',
				field: {
					xtype: 'datefield',
					format: 'd.m.Y H:i',
					value: Ext.Date.parse(Ext.Date.format(new Date(), 'd.m.Y H:i'), 'd.m.Y H:i')
				}
			},
			{
				width: 70,
				header: 'Тип',
				dataIndex: 'type',
				xtype: 'combocolumn',
				store: 'app.store.AutoTransport.Income.IncType'
			},
			{
				width: 170,
				header: 'Поставщик',
				dataIndex: 'at_seller',
				xtype: 'combocolumn',
				store: 'app.store.AutoTransport.Sellers',
				allowNull: true
			},
			{
				width: 70,
				xtype: 'numbercolumn',
				format: '0,00',
				header: 'Сумма',
				dataIndex: 'sum'
			}
		]
	}
});