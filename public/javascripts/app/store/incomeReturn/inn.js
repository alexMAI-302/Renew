Ext.define('app.store.incomeReturn.inn', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueStrModel',
			proxy: {
				type: 'ajax',
				url : '/income_return/get_inn',
				reader: {
					type: 'json'
				}
			}
});