//локальное хранилище записей по позициям в заказе
Ext.define('app.store.mag.palmSaleItemsLocal', {
	extend: 'Ext.data.Store',

	model: 'app.model.mag.palmSaleItemModel',
	proxy: {
		type: 'localstorage',
		id  : 'unactmag-palmsaleorderitem'
	}
});