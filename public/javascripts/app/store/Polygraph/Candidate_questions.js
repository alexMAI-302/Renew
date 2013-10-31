Ext.define('app.store.Polygraph.Candidate_questions', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/polygraph/get_candidate_questions',
		reader: {
			type: 'json'
		}
	}
});