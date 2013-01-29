Ext.define('app.store.TermDelivery.MakeAutoSetup.Terminals', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.MakeAutoSetup.TerminalModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/make_auto_setup/terminals',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});
