//локальное хранилище записей по текущему заказу
Ext.define('app.store.mag.currentPalmSaleItemsLocal', {
	extend: 'Ext.data.Store',

	model: 'app.model.mag.palmSaleItemModel',
	proxy: {
		type: 'localstorage',
		id  : 'unactmag-currentpalmsaleitem'
	}
});