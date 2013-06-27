Ext.define('app.model.renewUrls.RenewUrlModel', {
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
		name: "url_pattern",
		type: "string"
	},
	{
		name: "url_type_id",
		type: "int"
	},
	{
		name: "sorder",
		type: "int",
		useNull: true
	}]
});