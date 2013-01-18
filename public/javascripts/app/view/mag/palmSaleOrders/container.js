Ext.define('app.view.mag.palmSaleOrders.container', {
    extend: 'Ext.container.Container',
	alias: 'widget.ordersContainer',
	
	requires: [
		'app.view.Lib.DateIntervalFilter',
		'app.view.mag.palmSaleOrders.itemsGrid',
		'app.view.mag.palmSaleOrders.Grid'
	],

    layout: {
		type: 'anchor'
	},
	
	items: [
        {
			xtype: 'dateIntervalFilter',
			suffix: 'PalmSales',
			shiftEnd: 1
		},
		{
			xtype: 'ordersGrid'
		},
		{
			xtype: 'orderItemsGrid'
		}
    ]
});