Ext.define('app.model.Polygraph.CandidateAnswers', {
	extend: 'Ext.data.Model',
	fields: [
	{
		name: "id",
		type: "int"
	},
	{
		name: "candidate_id",
		type: "int"
	},
	{
		name: "question_id",
		type: "int"
	},

	{
		name: "name",
		type: "string"
	}

	]
});