Ext.define('app.store.PricesForComparison.Pricelist', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/prices_for_comparison/get_pricelist',
		reader: {
			type: 'json'
		}
	}
});
