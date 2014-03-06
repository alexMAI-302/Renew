Ext.define('app.view.RequestBudgets.Container', {
    extend: 'app.view.Lib.Grid.Panel',

	requires: [
		'app.view.Lib.Grid.column.ComboColumn',
		'app.view.RequestBudgets.Filter'
	],

	title: 'Заявки на бюджеты от производителей',
	
	renderTo: 'request_budgets_js',

	height: Ext.getBody().getViewSize().height - 150,
	
	config:{
		suffix: 'RequestBudgets',
		store: 'RequestBudgets.RequestBudgets',
		disableDelete: true,
		beforeButtons: [
			{
				xtype: 'filterRequestBudgets'
			}
		],


		
		columns : [
					{
				xtype: 'datecolumn',
				width: 100,
				header: 'Дата',
				dataIndex: 'ddate',
				name: 'ddate',
				format: 'd.m.Y',
				field: {
					xtype: 'datefield'
				}
			},
			{
				width : 150,
				header : 'Сотрудник',
				dataIndex : 'person',
				xtype: 'combocolumn',
				store: 'app.store.RequestBudgets.Person'
			},
			{
				align: 'center',
				width : 100,
				header : 'Отдел',
				dataIndex : 'emp_dept'
			},
			{
				width : 150,
				header : 'Партнер',
				dataIndex : 'partner',
				xtype: 'combocolumn',
				store: 'app.store.RequestBudgets.Partners'
			},
			{
				width : 150,
				header : 'Канал NRC',
				dataIndex : 'channel_NRC',
				xtype: 'combocolumn',
				store: 'app.store.RequestBudgets.channel_NRC'
			},
			{
				width : 150,
				header : 'Контракт с поставщиком',
				dataIndex : 'tmside',
				xtype: 'combocolumn',
				store: 'app.store.RequestBudgets.tmside'
			},
			{
				width : 100,
				header : 'КМ',
				dataIndex : 'catmanager'
			},
			{
				width: 100,
				renderer: Ext.util.Format.numberRenderer('0.00'),
				header: 'Сумма',
				dataIndex: 'summ',
				field: {
     					xtype: 'numberfield',
						minValue: 0,
						decimalPrecision : 2,
						decimalSeparator : ','

				}
			},
			{
				align: 'center',
				width : 200,
				header : 'Комментарий',
				dataIndex : 'comm',
				field: {
					xtype: 'textfield'
				}
			},
			{
			header : 'Подтверждено',
			xtype : 'checkcolumn',
			dataIndex : 'priznak',
			width : 100,
			disabled: true
		},
		{
				width : 500,
				header : 'Активность',
				dataIndex : 'tmreport_name'
		}




						
			

			
		]
	}
});