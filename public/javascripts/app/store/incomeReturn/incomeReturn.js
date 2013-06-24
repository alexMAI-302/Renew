Ext.define('app.store.incomeReturn.incomeReturn', {
	extend: 'Ext.data.Store',
	model: 'app.model.incomeReturn.incomeReturnModel',
	id: 'subid',
	proxy: {
		type: 'rest',
		url : '/income_return/income_return',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});