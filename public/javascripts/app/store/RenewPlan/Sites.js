Ext.define('app.store.RenewPlan.Sites', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/renew_plan/get_sites',
		reader: {
			type: 'json'
		}
	}
});