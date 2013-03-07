Ext.define('app.model.OutsideUsers.UserModel', {
	extend: 'Ext.data.Model',
	fields: [
	{
		name: "id",
		type: "int"
	},
	{
		name: "renew_user_id",
		type: "int"
	},
	{
		name: "system_id",
		type: "int",
		persit: false
	},
	{
		name: "email",
		type: "string",
		persit: false
	},
	{
		name: "account_info",
		type: "string",
		persit: false
	}]
});