Ext.define('app.store.TermDelivery.MakeAutoIncSetup.Periods', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/term_delivery/make_auto_inc_setup/get_periods',
		reader: {
			type: 'json'
		}
	}
});
