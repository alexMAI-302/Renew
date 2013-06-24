Ext.define('app.store.incomeReturn.income', {
	extend: 'Ext.data.Store',
	model: 'app.model.incomeReturn.incomeModel',
			proxy: {
				type: 'ajax',
				url : '/income_return/get_income',
				reader: {
					type: 'json'
				}
			}
});