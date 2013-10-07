Ext.define('app.view.goodsCatalog.CatGoodsInUnionGrid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.catGoodsInUnionGrid',
	
	config: {
		store: 'goodsCatalog.CatGoodsInUnion',
		suffix: 'CatGoodsInUnion',
		disableDeleteColumn: true,
		disableAdd: true,
		title: 'Товары CAT в товаре каталога',
		selModel: {
			mode: "MULTI"
		},
		selType: 'checkboxmodel',
		disabled: true,
		columns: [
			{
				width: 300,
				header: 'Наименование',
				dataIndex: 'name'
			},
			{
				width: 400,
				header: 'Родительские товары каталога',
				dataIndex: 'union_goods_names'
			}
		]
	}
});