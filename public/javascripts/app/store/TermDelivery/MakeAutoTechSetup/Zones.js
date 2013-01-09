Ext.define('app.store.TermDelivery.MakeAutoTechSetup.Zones', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.MakeAutoTechSetup.ZoneModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/make_auto_tech_setup/zones',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});
