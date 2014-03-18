Ext.define('app.store.Polygraph.Person_questions', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/polygraph/get_person_questions',
		reader: {
			type: 'json'
		}
	}
});