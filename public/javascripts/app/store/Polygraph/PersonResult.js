Ext.define('app.store.Polygraph.PersonResult', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/polygraph/get_polygraph_person_result',
		reader: {
			type: 'json'
		}
	}
});