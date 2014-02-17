Ext.define('app.store.PricesForComparison.Lggroup', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/prices_for_comparison/get_lggroup',
		reader: {
			type: 'json'
		}
	}
});
