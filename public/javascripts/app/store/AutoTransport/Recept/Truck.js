//хранилище отделений банка
Ext.define('app.store.AutoTransport.Recept.Truck', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/auto_transport/get_trucks',
		reader: {
			type: 'json'
		}
	}
});