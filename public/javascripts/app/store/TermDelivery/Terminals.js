//хранилище отделений банка
Ext.define('app.store.TermDelivery.Terminals', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.TerminalModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/terminals',
		reader: {
			type: 'json'
		}
	}
});
