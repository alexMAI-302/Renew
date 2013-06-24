Ext.define('app.view.AutoTransport.Sellers.Container', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.sellersTab',
	
	title: 'Поставщики',
	
	config:
	{
		xtype: 'simpleGrid',
		store: 'AutoTransport.Sellers',
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
});