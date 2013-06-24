Ext.define('app.store.incomeReturn.mrs', {
	extend: 'Ext.data.Store',
	model: 'app.model.incomeReturn.mrsModel',
	proxy: {
		type: 'ajax',
		url : '/income_return/get_mrs',
		reader: {
			type: 'json'
		}
	},
	autoLoad: true
});