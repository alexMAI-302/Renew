Ext.define('app.store.salesmanCash.PalmSalesmans', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/salesman_cash/get_salesmans',
		reader: {
			type: 'json'
		}
	}
});