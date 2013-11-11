Ext.define('app.view.goodsCatalog.UnionGoodsGrid', {
    extend: 'app.view.Lib.Grid.Panel',
	alias: 'widget.unionGoodsGrid',
	
	config: {
		store: 'goodsCatalog.UnionGoods',
		suffix: 'UnionGoods',
		disableDeleteColumn: true,
		enableBuffering: true,
		title: 'Товары каталога',
		selModel: {
			mode: "MULTI"
		},
		selType: 'checkboxmodel',
		beforeButtons:[
			{
				id: 'UnionGoodsName',
				xtype: 'textfield',
				fieldLabel: 'Наименование товара',
				enableKeyEvents: true,
				width: 400,
				labelWidth: 120
			}
		],
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