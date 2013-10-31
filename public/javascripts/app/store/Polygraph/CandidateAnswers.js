Ext.define('app.store.Polygraph.CandidateAnswers', {
	extend: 'Ext.data.Store',
	model: 'app.model.Polygraph.CandidateAnswers',
	proxy: {
		type: 'rest',
		url : '/polygraph/get_candidate_answers',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});