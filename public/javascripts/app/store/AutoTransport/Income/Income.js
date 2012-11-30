//хранилище отделений банка
Ext.define('app.store.AutoTransport.Income.Income', {
	extend: 'Ext.data.Store',
	model: 'app.model.AutoTransport.IncomeModel',
	proxy: {
		type: 'rest',
		url : '/auto_transport/income',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});