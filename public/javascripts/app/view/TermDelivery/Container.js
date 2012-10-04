Ext.define('app.view.TermDelivery.container', {
    extend: 'Ext.container.Container',
	alias: 'widget.ordersContainer',
	
	requires: [
		'app.view.mag.palmSaleOrders.filter',
		'app.view.mag.palmSaleOrders.itemsGrid',
		'app.view.mag.palmSaleOrders.Grid'
	],

    layout: {
		type: 'border'
	},
	
	items: [
        {
			xtype: 'Filter',
			region: 'north'
		},
		{
			xtype: 'routesGrid',
			region: 'west'
		},
		{
			xtype: 'terminalsGrid',
			region: 'center'
		}
    ]
});