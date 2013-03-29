Ext.define('app.store.TermDelivery.MakeAutoIncSetup.PpsZoneNormes', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.MakeAutoIncSetup.PpsZoneNormModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/make_auto_inc_setup/pps_zone_normes',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});
