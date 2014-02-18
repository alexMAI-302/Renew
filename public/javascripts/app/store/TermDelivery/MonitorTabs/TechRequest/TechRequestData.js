Ext.define('app.store.TermDelivery.MonitorTabs.TechRequest.TechRequestData', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.MonitorTabs.TechRequest.TechRequestModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/monitor/techrequest_get_data',
		reader: {
			type: 'json'
		}
	}
});