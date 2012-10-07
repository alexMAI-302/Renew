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
					id: 'printRoute',
					icon: '/ext/examples/ux/grid/gridPrinterCss/printer.png',
					handler: function(view, rowIndex, colIndex, item, e){
						
					}
				},
				{
					xtype: 'actioncolumn',
					width: 25,
					header: 'ИЗ',
					align: 'center',
					id: 'is',
					icon: '/ext/examples/ux/grid/gridPrinterCss/printer.png',
					handler: function(view, rowIndex, colIndex, item, e){
						
					}
				},
				{
					xtype: 'actioncolumn',
					width: 25,
					align: 'center',
					icon: '/ext/examples/ux/grid/gridPrinterCss/printer.png',
					handler: function(view, rowIndex, colIndex, item, e){
						
					}
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
