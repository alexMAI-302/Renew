Ext.define('app.store.RenewPlan.Goods', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/util_data/get_goods',
		reader: {
			type: 'json'
		}
	}
});