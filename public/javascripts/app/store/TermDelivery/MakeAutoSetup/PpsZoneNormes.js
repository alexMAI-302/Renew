Ext.define('app.store.TermDelivery.MakeAutoSetup.PpsZoneNormes', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.MakeAutoSetup.PpsZoneNormeModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/make_auto_setup/pps_zone_normes',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});
