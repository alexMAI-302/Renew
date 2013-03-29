Ext.define('app.store.TermDelivery.MakeAutoCommonSetup.Terminals', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.MakeAutoCommonSetup.TerminalModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/make_auto_common_setup/terminals',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});
