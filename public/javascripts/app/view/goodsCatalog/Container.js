Ext.define('app.view.goodsCatalog.Container', {
    extend: 'Ext.container.Container',
	
	requires: [
		'app.view.goodsCatalog.CatGoodsInUnionGrid',
		'app.view.goodsCatalog.UnionGoodsGrid',
		'app.view.goodsCatalog.UnionPicturesList',
		'app.view.goodsCatalog.CatGoodsGrid'
	],
	
	renderTo: 'goods_catalog_js',
	height: Ext.getBody().getViewSize().height - 120,
	
	layout: {
		type: 'border'
	},
	
	items: [
		{
			region: 'center',
			layout: {
				type: 'border'
			},
			items: [
				{
					xtype: 'unionGoodsGrid',
					region: 'north',
					height: 250,
					split: true
				},
				{
					xtype: 'catGoodsInUnionGrid',
					region: 'center'
				},
				{
					xtype: 'unionPicturesList',
					region: 'west',
					width: 130,
					split: true
				}
			]
		},
		{
			region: 'east',
			xtype: 'catGoodsGrid',
			width: 800,
			split: true
		}
	]
});