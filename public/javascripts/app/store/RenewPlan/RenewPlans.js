Ext.define('app.store.RenewPlan.RenewPlans', {
	extend: 'Ext.data.Store',
	model: 'app.model.RenewPlan.RenewPlanModel',
	proxy: {
		type: 'rest',
		url : '/renew_plan/renew_plan',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});