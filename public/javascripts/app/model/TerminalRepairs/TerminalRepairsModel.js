Ext.define('app.model.TerminalRepairs.TerminalRepairsModel', {
	extend: 'Ext.data.Model',
	fields: [
	{
		name: "id",
		type: "int"
	},
	{
		name: "repair_name",
		type: "string"
	},
	{
		name: "is_tech",
		type: "boolean"
	},
	{
		name: "is_inc",
		type: "boolean"
	},
	{
		name: "is_eng",
		type: "boolean"
	}
	]
});
