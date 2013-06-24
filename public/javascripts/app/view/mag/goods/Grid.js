Ext.define('app.view.mag.goods.Grid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.goodsGrid',
	
	config: {
		suffix: 'Goods',
		disableDeleteColumn: true,
		disableDelete: true,
		disableAdd: true,
		disableSave: true,
		columns: [
			{
				width: 300,
				header: 'Штрих-код',
				dataIndex: 'barcode'
			},
			{
				width: 400,
				header: 'Наименование товара',
				dataIndex: 'name'
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
				width: 70,
				header: 'Цена<br/>товара',
				dataIndex: 'price'
			},
			{
				header: 'Остаток',
				dataIndex: 'volume',
				width: 70
			}
		]
	}
});
