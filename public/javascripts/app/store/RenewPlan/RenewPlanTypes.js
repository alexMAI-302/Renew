Ext.define('app.store.RenewPlan.RenewPlanTypes', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/renew_plan/get_renew_plan_types',
		reader: {
			type: 'json'
		}
	}
});