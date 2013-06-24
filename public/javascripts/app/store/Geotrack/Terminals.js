Ext.define('app.store.Geotrack.Terminals', {
	extend: 'Ext.data.Store',
	model: 'app.model.Geotrack.TerminalModel',
	proxy: {
		type: 'rest',
		url : '/geotrack/get_terminals',
		reader: {
			type: 'json'
		}
	}
});