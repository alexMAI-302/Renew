Ext.define('app.store.RequestBudgets.channel_NRC', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/request_budgets/get_channel_nrs',
		reader: {
			type: 'json'
		}
	}
});