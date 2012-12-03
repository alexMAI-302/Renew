Ext.define('app.view.AutoTransport.Recept.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.receptTab',
	
	requires: [
		'app.view.AutoTransport.Recept.Filter',
		'app.view.AutoTransport.Recept.ItemsGrid',
		'app.view.AutoTransport.Recept.Grid'
	],
	
	layout: {
		type: 'border'
	},
	
	title: 'Расход',
	
	items: [
		{
			xtype: 'receptFilter',
			region: 'north'
		},
		{
			xtype: 'receptGrid',
			region: 'center',
			split: true,
			flex: 1
		},
		{
			xtype: 'recGoodsGrid',
			region: 'south',
			flex: 1
		}
	]
});