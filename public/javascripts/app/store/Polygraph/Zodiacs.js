Ext.define('app.store.Polygraph.Zodiacs', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/polygraph/get_zodiacs',
		reader: {
			type: 'json'
		}
	}
});