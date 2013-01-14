Ext.define('app.store.TermDelivery.MakeAutoSetup.Zones', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/term_delivery/make_auto_setup/get_zones',
		reader: {
			type: 'json'
		}
	}
});
