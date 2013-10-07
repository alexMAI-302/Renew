Ext.define('app.store.goodsCatalog.UnionGoods', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/goods_catalog/union_goods',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});