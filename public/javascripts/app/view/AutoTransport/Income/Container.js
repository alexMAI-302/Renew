Ext.define('app.view.AutoTransport.Income.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.incomeTab',
	
	requires: [
		'app.view.AutoTransport.Income.Filter',
		'app.view.AutoTransport.Income.ItemsGrid',
		'app.view.AutoTransport.Income.Grid'
	],
	
	layout: {
		type: 'border'
	},
	
	items: [
		{
			xtype: 'incomeFilter',
			region: 'north'
		},
		{
			xtype: 'incomeGrid',
			region: 'center',
			split: true,
			flex: 1
		},
		{
			xtype: 'incGoodsGrid',
			region: 'south',
			flex: 1
		}
	]
});