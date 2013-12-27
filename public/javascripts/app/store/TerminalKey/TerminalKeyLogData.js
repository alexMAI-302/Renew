Ext.define('app.store.TerminalKey.TerminalKeyLogData', {
	extend: 'Ext.data.Store',
	model: 'app.model.TerminalKey.TerminalKeyLogModel',
	proxy: {
		type: 'rest',
		url : '/terminal_key/terminal_key_log',
		reader: {
			type: 'json'
		}
	}
});