Ext.define('app.store.incomeReturn.pr', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueStrModel',
			proxy: {
				type: 'ajax',
				url : '/income_return/get_pr',
				reader: {
					type: 'json'
				}
			},
			autoLoad: true
});