//локальное хранилище записей по заказам
Ext.define('app.store.mag.palmSales', {
	extend: 'Ext.data.Store',

	model: 'app.model.mag.palmSaleModel',
	proxy: {
        type: 'memory'
	}
});