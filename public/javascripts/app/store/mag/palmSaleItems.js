//локальное хранилище записей по позициям в заказе
Ext.define('app.store.mag.palmSaleItems', {
	extend: 'Ext.data.Store',

	model: 'app.model.mag.palmSaleItemModel',
	proxy: {
        type: 'memory'
	}
});