Ext.define('app.store.TerminalKey.TerminalKeyData', {
	extend: 'Ext.data.Store',
	model: 'app.model.TerminalKey.TerminalKeyModel',
	proxy: {
		type: 'rest',
		url : '/terminal_key/terminal_key',
		reader: {
			type: 'json'
		}
	}
});