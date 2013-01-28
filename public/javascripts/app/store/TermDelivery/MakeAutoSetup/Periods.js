Ext.define('app.store.TermDelivery.MakeAutoSetup.Periods', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/term_delivery/make_auto_setup/get_periods',
		reader: {
			type: 'json'
		}
	}
});
