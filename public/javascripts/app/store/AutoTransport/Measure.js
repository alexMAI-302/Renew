//хранилище отделений банка
Ext.define('app.store.AutoTransport.Measure', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/auto_transport/get_measures',
		reader: {
			type: 'json'
		}
	}
});