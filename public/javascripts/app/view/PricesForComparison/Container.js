Ext.define('app.view.PricesForComparison.Container', {
	extend : 'app.view.Lib.Grid.Panel',
	requires : ['app.view.Lib.Grid.column.ComboColumn'],
	title : 'Прайс-листы для сравнения',

	renderTo : 'prices_for_comparison_js',
	height : Ext.getBody().getViewSize().height - 150,

	config : {
		suffix : 'PricesForComparison',
		store : 'PricesForComparison.PricesForComparison',
		disableDelete : true,
		columns : [{
			width : 200,
			header : 'Группа для<br>планирования',
			dataIndex : 'lggroup',
			xtype : 'combocolumn',
			store : 'app.store.PricesForComparison.Lggroup'
		}, {
			width : 150,
			header : 'SVIP',
			dataIndex : 'svip',
			xtype : 'combocolumn',
			store : 'app.store.PricesForComparison.Pricelist'
		}, {
			width : 150,
			header : 'VIP',
			dataIndex : 'vip',
			xtype : 'combocolumn',
			store : 'app.store.PricesForComparison.Pricelist'
		}, {
			width : 150,
			header : 'СТОП',
			dataIndex : 'lstop',
			xtype : 'combocolumn',
			store : 'app.store.PricesForComparison.Pricelist'
		}, {
			width : 150,
			header : 'ВХОД',
			dataIndex : 'linput',
			xtype : 'combocolumn',
			store : 'app.store.PricesForComparison.Pricelist'
		}, {
			width : 150,
			header : 'ОРТ 1',
			dataIndex : 'ort1',
			xtype : 'combocolumn',
			store : 'app.store.PricesForComparison.Pricelist'
		}, {
			width : 150,
			header : 'ОРТ 2',
			dataIndex : 'ort2',
			xtype : 'combocolumn',
			store : 'app.store.PricesForComparison.Pricelist'
		}, {
			width : 150,
			header : 'ОРТ 3',
			dataIndex : 'ort3',
			xtype : 'combocolumn',
			store : 'app.store.PricesForComparison.Pricelist'
		}, {
			width : 150,
			header : 'ОРТ 4',
			dataIndex : 'ort4',
			xtype : 'combocolumn',
			store : 'app.store.PricesForComparison.Pricelist'
		}, {
			width : 150,
			header : 'ОРТ 5',
			dataIndex : 'ort5',
			xtype : 'combocolumn',
			store : 'app.store.PricesForComparison.Pricelist'
		}, {
			width : 150,
			header : 'ОРТ 6',
			dataIndex : 'ort6',
			xtype : 'combocolumn',
			store : 'app.store.PricesForComparison.Pricelist'
		}, {
			width : 200,
			header : 'Информация',
			dataIndex : 'comm',
			field : {
				xtype : 'textfield'
			}
		}]
	}
});
