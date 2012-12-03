//хранилище отделений банка
Ext.define('app.store.AutoTransport.Recept.Recept', {
	extend: 'Ext.data.Store',
	model: 'app.model.AutoTransport.ReceptModel',
	proxy: {
		type: 'rest',
		url : '/auto_transport/recept',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});