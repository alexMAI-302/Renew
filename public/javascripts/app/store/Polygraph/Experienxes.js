Ext.define('app.store.Polygraph.Experienxes', {
	extend: 'Ext.data.Store',
	model: 'app.model.Polygraph.Experienxes',
	proxy: {
		type: 'rest',
		url : '/polygraph/get_experienxes',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});