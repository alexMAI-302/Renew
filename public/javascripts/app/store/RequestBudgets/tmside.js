Ext.define('app.store.RequestBudgets.tmside', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/request_budgets/get_tmside',
		reader: {
			type: 'json'
		}
	}
});