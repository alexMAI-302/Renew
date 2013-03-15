Ext.define('app.store.RenewPlan.Sellers', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/renew_plan/get_sellers',
		reader: {
			type: 'json'
		}
	}
});