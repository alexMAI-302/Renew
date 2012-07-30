//проба
Ext.define('app.view.mag.palmSaleOrders.itemsGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.orderItemsGrid',
	
	cls: 'palmSaleOrderItems-grid',
	
	noRemains: 'Не хватает остатков',
	ready: 'Готово',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'palmSaleOrderItemsTable',
			columns: [
				// {
					// header: 'Идентификатор',
					// dataIndex: 'id',
					// hidden: true,
					// disabled: true
				// },
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
			height: 200,
			viewConfig: {
				enableTextSelection: true
			}
		});
        
        this.callParent(arguments);
    }
});
