Ext.define('app.model.Polygraph.PolygraphPerson', {
	extend: 'Ext.data.Model',
	fields: [
	{
		name: "id",
		type: "int"
	},
	{
		name: "result_id",
		type: "int",
		useNull: true
	},
	{
		name: "person",
		type: "int",
		useNull: true
	},
	{
		name: "marital_status",
		type: "int",
		useNull: true

	},
	{
		name: "children_count",
		type: "int"
	},
	{
		name: "info",
		type: "string"
	},
	{
		name: 'ddate',
		type:'date'
	},
	
	]
});
