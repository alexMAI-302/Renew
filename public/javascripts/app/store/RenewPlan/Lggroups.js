Ext.define('app.store.RenewPlan.Lggroups', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/renew_plan/get_lggroups',
		reader: {
			type: 'json'
		}
	}
});