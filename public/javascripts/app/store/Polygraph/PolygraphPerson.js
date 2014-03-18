Ext.define('app.store.Polygraph.PolygraphPerson', {
	extend: 'Ext.data.Store',
	model: 'app.model.Polygraph.PolygraphPerson',
	proxy: {
		type: 'rest',
		url : '/polygraph/get_persons',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});
