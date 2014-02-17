Ext.define('app.store.TermDelivery.MonitorTabs.TechRequest.Zones', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/monitor/techrequest_get_zones',
		reader: {
			type: 'json'
		}
	}
});