Ext.define('app.store.Letter.Agents', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/letter/get_agents',
		reader: {
			type: 'json'
		}
	}
});