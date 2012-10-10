//хранилище терминалов
Ext.define('app.store.TermDelivery.Terminals', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.TerminalModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/get_terminals',
		reader: {
			type: 'json'
		}
	}
});
