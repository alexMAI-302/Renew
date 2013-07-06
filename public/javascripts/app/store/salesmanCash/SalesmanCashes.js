Ext.define('app.store.salesmanCash.SalesmanCashes', {
	extend: 'Ext.data.Store',
	model: 'app.model.salesmanCash.SalesmanCashModel',
	proxy: {
		type: 'rest',
		url : '/salesman_cash/salesman_cashes',
		batchActions: true,
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});