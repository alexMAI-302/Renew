Ext.define('app.model.Polygraph.PersonAnswer', {
	extend: 'Ext.data.Model',
	fields: [
	{
		name: "id",
		type: "int"
	},

	{
		name: "question_id",
		type: "int",
		useNull: true
	},

	{
		name: "name",
		type: "string"
	}

	]
});