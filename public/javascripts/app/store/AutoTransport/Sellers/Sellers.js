Ext.define('app.store.AutoTransport.Sellers.Sellers', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/auto_transport/sellers',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});