Ext.define('app.view.salesmanCash.Container', {
    extend: 'app.view.Lib.Grid.Panel',
	
	renderTo: 'salesman_cash_js',
	height: Ext.getBody().getViewSize().height - 120,
	
	config:
	{
		xtype: 'simpleGrid',
		suffix: 'SalesmanCash',
		store: 'salesmanCash.SalesmanCashes',
		disableAdd: true,
		disableDelete: true,
		disableDeleteColumn: true,
		beforeButtons: [
			{
				id: 'salesmanCashPalmSalesmanFilter',
				xtype: 'combobox',
				fieldLabel: 'Торг. пред.',
				store: 'salesmanCash.PalmSalesmans',
				displayField: 'name',
				valueField: 'id',
				allowBlank: false,
				queryMode: 'local',
				width: 250,
				labelWidth: 70
			}
		],
		afterButtons: [
			{
				xtype: 'button',
				id: 'salesmanCashPrint',
				icon: '/ext/examples/ux/grid/gridPrinterCss/printer.png',
				tooltip: 'Распечатать'
			}
		],
		columns : [
			{
				width : 200,
				header : 'Накладная',
				dataIndex : 'ndoc',
				disabled: true
			},
			{
				width : 100,
				header : 'Дата',
				dataIndex : 'ddate',
				disabled: true,
				format: 'Y-m-d',
				xtype: 'datecolumn'
			},
			{
				width : 200,
				header : 'Задолженность',
				dataIndex : 'summ',
				disabled: true
			},
			{
				width : 200,
				header : 'Выручка',
				dataIndex : 'cash',
				field: {
					xtype: 'numberfield'
				}
			},
			{
				width : 40,
				header : 'Чек',
				dataIndex : 'status1',
				xtype: 'checkcolumn',
				disabled: true
			}
		]
	}
});