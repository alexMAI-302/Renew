Ext.define('app.view.mag.palmSaleOrders.itemsGrid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.orderItemsGrid',
	
	config: {
		suffix: 'PalmSaleOrderItems',
		disableDeleteColumn: true,
		disableDelete: true,
		disableAdd: true,
		disableSave: true,
		disableRefresh: true,
		columns: [
			{
				width: 200,
				header: 'Штрих-код',
				dataIndex: 'barcode'
			},
			{
				width: 70,
				header: '"Хороший"<br/>товар',
				align: 'center',
				dataIndex: 'is_good',
				xtype: 'checkcolumn',
				listeners: {
					beforecheckchange: function(checkColumn, rowIndex, checked, eOpts){
						return false;
					}
				}
			},
			{
				width: 250,
				header: 'Товар',
				dataIndex: 'name'
			},
			{
				width: 40,
				header: 'Цена',
				dataIndex: 'price'
			},
			{
				header: 'Количество',
				dataIndex: 'volume',
				width: 70,
				field: {
					xtype: 'numberfield',
					minValue: 1
				}
			},
			{
				header: 'Сумма',
				dataIndex: 'cost',
				width: 70
			},
		],
		height: 200
	}
});
