Ext.define('app.store.goodsCatalog.Pictures', {
	extend: 'Ext.data.Store',
	model: 'app.model.goodsCatalog.PictureModel',
	proxy: {
		type: 'rest',
		url : '/goods_catalog/union_pictures',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});