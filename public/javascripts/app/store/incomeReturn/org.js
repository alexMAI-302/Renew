Ext.define('app.store.incomeReturn.org', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueStrModel',
			proxy: {
				type: 'ajax',
				url : '/income_return/get_org',
				reader: {
					type: 'json'
				}
			},
			autoLoad: true
});