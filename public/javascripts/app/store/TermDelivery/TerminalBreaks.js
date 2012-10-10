//хранилище поломок терминала
Ext.define('app.store.TermDelivery.TerminalBreaks', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/get_terminal_breaks',
		reader: {
			type: 'json'
		}
	},
	autoLoad: true
});
