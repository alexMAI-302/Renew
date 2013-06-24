Ext.define('app.view.AutoTransport.Recept.ItemsGrid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.recGoodsGrid',
	requires: 'app.view.Lib.Grid.column.ComboColumn',
	
	config: {
		suffix: 'RecGoods',
		store: 'AutoTransport.Recept.RecGoods',
		disabled: true,
		disableSave: true,
		disableDeleteColumn: true,
		disabled: true,
		columns: [
			{
				width: 170,
				header: 'Группа',
				dataIndex: 'at_ggroup',
				xtype: 'combocolumn',
				store: 'app.store.AutoTransport.Ggroup'
			},
			{
				width: 400,
				header: 'Наименование',
				dataIndex: 'at_goods',
				xtype: 'combocolumn',
				store: 'app.store.AutoTransport.Goods'
			},
			{
				width: 80,
				header: 'Количество',
				dataIndex: 'vol',
				field: {
					xtype: 'numberfield',
					minValue: 0.0001
				}
			},
			{
				width: 120,
				header: 'Единица измерения',
				dataIndex: 'measure',
				xtype: 'combocolumn',
				store: 'app.store.AutoTransport.Measure',
				onlyRenderer: true
			}
		],
		features:[
			{
				ftype : 'summary'
			}
		]
	}
});