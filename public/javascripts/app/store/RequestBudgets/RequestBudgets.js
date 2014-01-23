Ext.define('app.store.RequestBudgets.RequestBudgets', {
	extend: 'Ext.data.Store',
	model: 'app.model.RequestBudgets.UserModel',
	proxy: {
		type: 'rest',
		url : '/request_budgets/request_budgets',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});