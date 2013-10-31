Ext.define('app.store.Polygraph.Candidates', {
	extend: 'Ext.data.Store',
	model: 'app.model.Polygraph.Candidates',
	proxy: {
		type: 'rest',
		url : '/polygraph/get_candidates',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});