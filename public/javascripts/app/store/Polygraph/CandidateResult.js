Ext.define('app.store.Polygraph.CandidateResult', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/polygraph/get_candidate_results',
		reader: {
			type: 'json'
		}
	}
});