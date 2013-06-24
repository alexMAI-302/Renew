Ext.define('app.store.incomeReturn.site', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueStrModel',
			proxy: {
				type: 'ajax',
				url : '/income_return/get_site',
				reader: {
					type: 'json'
				}
			}
			,
	autoLoad: true
});