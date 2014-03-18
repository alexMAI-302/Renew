Ext.define('app.store.Polygraph.PersonAnswer', {
	extend: 'Ext.data.Store',
	model: 'app.model.Polygraph.PersonAnswer',
	proxy: {
		type: 'rest',
		url : '/polygraph/get_person_answers',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});