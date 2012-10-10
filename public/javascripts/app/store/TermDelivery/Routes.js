//хранилище отделений банка
Ext.define('app.store.TermDelivery.Routes', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.RouteModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/get_routes',
		reader: {
			type: 'json'
		}
	}
});
