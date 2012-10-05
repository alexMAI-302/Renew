//таблица
Ext.define('app.view.TermDelivery.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.routesGrid',
	
	cls: 'routes-grid',
    
    initComponent: function() {
        Ext.apply(this, {
			id: 'routesTable',
			columns: [
				{
					width: 100,
					header: 'Маршрут',
					dataIndex: 'name'
				},
				{
					header: 'Терминалов',
					columns: [
						{
							header: 'Всего',
							align: 'center',
							dataIndex: 'terminals_quantity',
							width: 50
						},
						{
							header: 'В<br/>маршруте',
							align: 'center',
							dataIndex: 'terminals_in_route',
							width: 60
						}
					]
				},
				{
					xtype: 'actioncolumn',
					width: 25,
					header: 'П',
					align: 'center',
					id: 'p',
					items: [
					{
						icon: '/ext/examples/ux/grid/gridPrinterCss/printer.png'
					}]
				},
				{
					xtype: 'actioncolumn',
					width: 25,
					header: 'ИЗ',
					align: 'center',
					id: 'is',
					items: [
					{
						icon: '/ext/examples/ux/grid/gridPrinterCss/printer.png'
					}]
				},
				{
					xtype: 'actioncolumn',
					width: 25,
					align: 'center',
					items: [
					{
						icon: '/ext/examples/ux/grid/gridPrinterCss/printer.png'
					}]
				}
			],
			tbar: [
				{
					text: 'Сохранить ИЗ',
					id: 'saveIS'
				}
			],
			selModel: {
				selType: 'rowmodel'
			},
			width: 290,
			viewConfig: {
				enableTextSelection: true
			}
		});
        
        this.callParent(arguments);
    }
});
