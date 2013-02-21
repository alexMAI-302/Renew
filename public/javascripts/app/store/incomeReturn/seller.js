Ext.define('app.store.incomeReturn.seller', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueStrModel',
			proxy: {
				type: 'ajax',
				url : '/income_return/get_seller',
				reader: {
					type: 'json'
				}
			},
			autoLoad: true
});