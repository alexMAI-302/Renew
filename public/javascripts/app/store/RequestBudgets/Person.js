Ext.define('app.store.RequestBudgets.Person', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/request_budgets/get_person',
		reader: {
			type: 'json'
		}
	}
});