Ext.define('app.store.TerminalRepairs.TerminalRepairs', {
	extend: 'Ext.data.Store',
	model: 'app.model.TerminalRepairs.TerminalRepairsModel',
	proxy: {
		type: 'rest',
		url : '/terminal_repairs/terminal_repairs',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});
