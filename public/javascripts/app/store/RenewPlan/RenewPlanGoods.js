Ext.define('app.store.RenewPlan.RenewPlanGoods', {
	extend: 'Ext.data.Store',
	model: 'app.model.RenewPlan.RenewPlanGoodsModel',
	proxy: {
		type: 'rest',
		url : '/renew_plan/renew_plan_goods',
		batchActions: true,
		reader: {
			root: 'renew_plan_goods'
		},
		writer: {
			type: 'json'
		}
	}
});