Ext.define('app.view.TermDelivery.Panel', {
    extend: 'Ext.form.Panel',
	
	requires: [
		'app.view.mag.palmSaleOrders.filter',
		'app.view.mag.palmSaleOrders.itemsGrid',
		'app.view.mag.palmSaleOrders.Grid'
	],

    layout: {
		type: 'border'
	},
	
	renderTo: Ext.get('term_delivery_js'),
	
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