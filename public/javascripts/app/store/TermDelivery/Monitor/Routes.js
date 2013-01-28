Ext.define('app.store.TermDelivery.Monitor.Routes', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.Monitor.RouteModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/monitor/get_routes',
		reader: {
			type: 'json'
		}
	}
});