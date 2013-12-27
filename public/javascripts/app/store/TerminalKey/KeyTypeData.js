Ext.define('app.store.TerminalKey.KeyTypeData', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/terminal_key/get_key_type',
		reader: {
			type: 'json'
		}
	}
});