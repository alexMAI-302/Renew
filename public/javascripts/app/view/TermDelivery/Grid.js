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
					width: 90,
					header: 'Маршрут',
					dataIndex: 'sumtotal'
				},
				{
					header: 'Терминалов',
					columns: [
						{
							header: 'Всего',
							dataIndex: 'volume_so',
							width: 70
						},
						{
							header: 'В<br/>маршруте',
							dataIndex: 'donevol_so',
							width: 40
						}
					]
				},
				{
					xtype: 'actioncolumn',
					width: 50,
					header: 'П',
					align: 'center',
					id: 'printPalmSale',
					items: [
					{
						icon: 'ext/examples/ux/grid/gridPrinterCss/printer.png'
					}]
				},
				{
					xtype: 'actioncolumn',
					width: 50,
					header: 'ИЗ',
					align: 'center',
					id: 'printPalmSale',
					items: [
					{
						icon: 'ext/examples/ux/grid/gridPrinterCss/printer.png'
					}]
				},
				{
					xtype: 'actioncolumn',
					width: 50,
					header: 'Э',
					align: 'center',
					id: 'printPalmSale',
					items: [
					{
						icon: 'ext/examples/ux/grid/gridPrinterCss/printer.png'
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
			height: 200,
			viewConfig: {
				enableTextSelection: true
			}
		});
        
        this.callParent(arguments);
    }
});
