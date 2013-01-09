//хранилище терминалов
Ext.define('app.store.TermDelivery.Monitor.Terminals', {
	extend: 'Ext.data.Store',
	model: 'app.model.TermDelivery.Monitor.TerminalModel',
	proxy: {
		type: 'rest',
		url : '/term_delivery/monitor/get_terminals',
		reader: {
			type: 'json'
		}
	}
});