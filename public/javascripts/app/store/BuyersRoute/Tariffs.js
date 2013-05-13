Ext.define('app.store.BuyersRoute.Tariffs', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/buyers_route/get_spv',
		reader: {
			type: 'json'
		}
	}
});