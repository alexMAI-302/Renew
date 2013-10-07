Ext.define('app.store.goodsCatalog.CatGoods', {
	extend: 'Ext.data.Store',
	model: 'app.model.goodsCatalog.GoodsModel',
	proxy: {
		type: 'rest',
		url : '/goods_catalog/get_goods',
		reader: {
			type: 'json'
		}
	}
});