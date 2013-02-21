Ext.define('app.store.incomeReturn.income', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueStrModel',
			proxy: {
				type: 'ajax',
				url : '/income_return/get_income',
				reader: {
					type: 'json'
				}
			},
			autoLoad: true
});