Ext.define('app.store.RequestBudgets.CurrentPerson', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/request_budgets/get_current_person',
		reader: {
			type: 'json'
		}
	},
	 autoLoad: true
});