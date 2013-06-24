//таблица
Ext.define('app.view.mag.palmSaleOrders.Grid', {
	extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.ordersGrid',
	
	config: {
		suffix: 'PalmSaleOrders',
		disableDeleteColumn: true,
		disableDelete: true,
		disableAdd: true,
		disableSave: true,
		disableRefresh: true,
		columns: [
			{
				xtype: 'rownumberer'
			},
			{
				xtype: 'datecolumn',
				width: 120,
				header: 'Дата и время',
				dataIndex: 'ddate',
				format: 'd.m.Y H:i'
			},
			{
				width: 90,
				header: 'Сумма заказа',
				dataIndex: 'sumtotal',
				summaryType: 'sum'
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
				xtype: 'actioncolumn',
				width: 50,
				align: 'center',
				id: 'printPalmSale',
				items: [
				{
					icon: '/ext/examples/ux/grid/gridPrinterCss/printer.png'
				}]
			},
			{
				xtype: 'actioncolumn',
				width: 20,
				id: 'delPalmSale',
				getClass: function(value, metaData, record){
					return record.get('closed') ? '' : 'x-remove-palm-sale';
				}
			}
		],
		features: [{
			ftype: 'summary'
		}],
		tbar: [
			{
				text: 'Синхронизировать заказы',
				id: 'syncPalmSales'
			}
		],
		height: 200
	}
});
