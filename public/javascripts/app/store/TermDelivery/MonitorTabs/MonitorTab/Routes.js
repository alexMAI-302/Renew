Ext.define('app.store.TermDelivery.MonitorTabs.MonitorTab.Routes', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.MonitorTabs.MonitorTab.RouteModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/monitor/get_routes',
		reader: {
			type: 'json'
		}
	}
});