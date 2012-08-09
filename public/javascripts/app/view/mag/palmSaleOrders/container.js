Ext.define('app.view.mag.palmSaleOrders.container', {
    extend: 'Ext.container.Container',
	alias: 'widget.ordersContainer',
	
	requires: [
		'app.view.mag.palmSaleOrders.filter',
		'app.view.mag.palmSaleOrders.itemsGrid',
		'app.view.mag.palmSaleOrders.Grid'
	],

    layout: {
		type: 'anchor'
	},
	
	items: [
        {
			xtype: 'ordersFilter'
		},
		{
			xtype: 'ordersGrid'
		},
		{
			xtype: 'orderItemsGrid'
		}
    ]
});