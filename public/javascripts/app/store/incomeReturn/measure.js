Ext.define('app.store.incomeReturn.measure', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueStrModel',
	proxy: {
		type: 'ajax',
		url : '/income_return/get_measure',
		reader: {
			type: 'json'
		}
	},
	autoLoad: true
});