//проба
Ext.define('app.view.mag.goods.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.goodsGrid',
	
	cls: 'goods-grid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'goodsTable',
			columns: [
				// {
					// header: 'Идентификатор',
					// dataIndex: 'id',
					// hidden: true,
					// disabled: true
				// },
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
			],
			tbar: [
				{
					text: 'Обновить информацию о товарах и остатках',
					id: 'refreshGoods'
				}
			],
			viewConfig: {
				enableTextSelection: true
			}
		});
        
        this.callParent(arguments);
    }
});
