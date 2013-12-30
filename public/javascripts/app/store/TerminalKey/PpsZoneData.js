Ext.define('app.store.TerminalKey.PpsZoneData', {
	extend: 'Ext.data.Store',
	model: 'app.model.TerminalKey.PpsZoneModel',
	proxy: {
		type: 'rest',
		url : '/terminal_key/get_pps_zone',
		reader: {
			type: 'json'
		}
	}
});