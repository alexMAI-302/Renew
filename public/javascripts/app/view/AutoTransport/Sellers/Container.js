Ext.define('app.view.AutoTransport.Sellers.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.sellersTab',
	
	requires: [
		'app.view.AutoTransport.Sellers.Grid'
	],
	
	layout: {
		type: 'border'
	},
	
	title: 'Поставщики',
	
	items: [
		{
			xtype: 'sellersGrid',
			region: 'center'
		}
	]
});