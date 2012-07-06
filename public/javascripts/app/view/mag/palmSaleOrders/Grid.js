//проба
Ext.define('app.view.mag.palmSaleOrders.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.ordersGrid',
	
	cls: 'palmSaleOrders-grid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'palmSaleOrdersTable',
			columns: [
				// {
					// header: 'Идентификатор',
					// dataIndex: 'id',
					// hidden: true,
					// disabled: true
				// },
				{
					width: 120,
					header: 'Дата и время',
					dataIndex: 'ddate'
				},
				{
					width: 90,
					header: 'Сумма заказа',
					dataIndex: 'cost'
				},
				{
					width: 100,
					header: 'Синхронизирован',
					align: 'center',
					dataIndex: 'is_sync',
					xtype: 'checkcolumn',
					listeners: {
						beforecheckchange: function(checkColumn, rowIndex, checked, eOpts){
							return false;
						}
					}
				},
				{
					xtype:'actioncolumn',
					width:20,
					id: 'printPalmSale',
					items: [
					{
						icon: 'ext/examples/shared/icons/fam/cross.gif'
					}]
				},
			],
			selModel: {
				selType: 'rowmodel'
			},
			height: 150,
			viewConfig: {
				enableTextSelection: true
			}
		});
        
        this.callParent(arguments);
    }
});
