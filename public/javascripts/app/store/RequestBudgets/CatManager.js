Ext.define('app.store.RequestBudgets.CatManager', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/request_budgets/get_catmanager',
		reader: {
			type: 'json'
		}
	}
});