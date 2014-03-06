Ext.define('app.store.RequestBudgets.Dept', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/request_budgets/get_dept',
		reader: {
			type: 'json'
		}
	}
});