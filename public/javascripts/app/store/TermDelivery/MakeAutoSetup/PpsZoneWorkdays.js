Ext.define('app.store.TermDelivery.MakeAutoSetup.PpsZoneWorkdays', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.MakeAutoSetup.PpsZoneWorkdayModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/make_auto_setup/pps_zone_workdays',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});
