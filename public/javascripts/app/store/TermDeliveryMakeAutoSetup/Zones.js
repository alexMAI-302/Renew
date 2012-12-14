Ext.define('app.store.TermDeliveryMakeAutoSetup.Zones', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDeliveryMakeAutoSetup.ZoneModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery_make_auto_setup/zones',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});
