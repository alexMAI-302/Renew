//проба
Ext.define('app.view.mag.goods.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.goodsGrid',
	
	cls: 'goods-grid',
	
	noRemains: 'Не хватает остатков',
	ready: 'Готово',
    
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
					width: 100,
					header: 'Штрих-код',
					dataIndex: 'barcode'
				},
				{
					width: 400,
					header: 'Наименование "хорошего" товара',
					dataIndex: 'good_goods_name'
				},
				{
					width: 250,
					header: 'Наименование "плохого" товара',
					dataIndex: 'bad_goods_name'
				},
				{
					width: 150,
					header: 'Цена "хорошего" товара',
					dataIndex: 'good_price'
				},
				{
					width: 150,
					header: 'Цена "плохого" товара',
					dataIndex: 'bad_price'
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
