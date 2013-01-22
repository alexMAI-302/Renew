Ext.define('app.view.AutoTransport.Sellers.Container', {
    extend: 'Ext.panel.Panel',
	alias: 'widget.sellersTab',
	
	requires: [
		'app.view.Lib.Grid.Panel'
	],
	
	layout: {
		type: 'anchor'
	},
	
	title: 'Поставщики',
	
	items: [
		{
			xtype: 'simpleGrid',
			suffix: 'Sellers',
			disableDeleteColumn: true,
			columns : [{
				width : 150,
				header : 'Наименование',
				dataIndex : 'name',
				field : {
					xtype : 'textfield',
				}
			}]
		}
	]
});