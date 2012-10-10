//хранилище отделений банка
Ext.define('app.store.TermDelivery.Routes', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.RouteModel',
	proxy: {
        type: 'memory'
	}
});
