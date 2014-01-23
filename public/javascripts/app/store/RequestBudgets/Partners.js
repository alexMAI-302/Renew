Ext.define('app.store.RequestBudgets.Partners', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/request_budgets/get_partners',
		reader: {
			type: 'json'
		}
	}
});