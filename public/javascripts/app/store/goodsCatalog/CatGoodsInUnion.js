Ext.define('app.store.goodsCatalog.CatGoodsInUnion', {
	extend: 'Ext.data.Store',
	model: 'app.model.goodsCatalog.GoodsModel',
	proxy: {
		type: 'rest',
		url : '/goods_catalog/cat_goods_in_union',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});