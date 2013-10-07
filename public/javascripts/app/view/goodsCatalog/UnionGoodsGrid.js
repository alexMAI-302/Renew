Ext.define('app.view.goodsCatalog.UnionGoodsGrid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.unionGoodsGrid',
	
	config: {
		store: 'goodsCatalog.UnionGoods',
		suffix: 'UnionGoods',
		disableDeleteColumn: true,
		title: 'Товары каталога',
		selModel: {
			mode: "MULTI"
		},
		selType: 'checkboxmodel',
		columns: [
			{
				width: 700,
				header: 'Наименование',
				dataIndex: 'name',
				field: {
					xtype: 'textfield'
				}
			}
		]
	}
});