Ext.define('app.model.IncrequestReason.UserModel', {
	extend: 'Ext.data.Model',
	fields: [
	{
		name: "id",
		type: "int"
	},
	{
		name: "name",
		type: "string"
	},
	{
		name: "responsibility_area_id",
		type: "int",
		useNull: true
	},
	{
		name: "used",
		type: "boolean"
	}
	
	]
});