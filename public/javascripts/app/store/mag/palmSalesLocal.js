//локальное хранилище записей по заказам
Ext.define('app.store.mag.palmSalesLocal', {
	extend: 'Ext.data.Store',

	model: 'app.model.mag.palmSaleModel',
	proxy: {
		type: 'localstorage',
		id  : 'unactmag-palmsaleorder'
	}
});