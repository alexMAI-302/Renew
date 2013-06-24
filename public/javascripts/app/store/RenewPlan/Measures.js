Ext.define('app.store.RenewPlan.Measures', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/util_data/get_measures',
		reader: {
			type: 'json'
		}
	}
});