Ext.define('app.store.Geotrack.Agents', {
	extend: 'Ext.data.Store',
	model: 'app.model.Geotrack.AgentModel',
	proxy: {
		type: 'rest',
		url : '/geotrack/get_agents',
		reader: {
			type: 'json'
		}
	}
});