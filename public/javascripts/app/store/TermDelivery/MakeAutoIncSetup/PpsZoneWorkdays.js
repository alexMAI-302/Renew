Ext.define('app.store.TermDelivery.MakeAutoIncSetup.PpsZoneWorkdays', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.MakeAutoIncSetup.PpsZoneWorkdayModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/make_auto_inc_setup/pps_zone_workdays',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});
