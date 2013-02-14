Ext.define('app.store.RenewPlan.RenewPlanGoods', {
	extend: 'Ext.data.Store',
	model: 'app.model.RenewPlan.RenewPlanGoodsModel',
	proxy: {
		type: 'rest',
		url : '/renew_plan/renew_plan_goods',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});