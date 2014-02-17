Ext.define('app.store.PricesForComparison.PricesForComparison', {
	extend: 'Ext.data.Store',
	model: 'app.model.PricesForComparison.PricesForComparisonModel',
	proxy: {
		type: 'rest',
		url : '/prices_for_comparison/prices_for_comparison',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});
