//хранилище товаров
Ext.define('app.store.mag.goods', {
	extend: 'Ext.data.Store',

    model: 'app.model.mag.goodsModel',
	proxy: {
        type: 'memory'
	}
});