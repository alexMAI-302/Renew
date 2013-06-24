Ext.define('app.model.outsideUsers.UserModel', {
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
		persist: false
	},
	{
		name: "email",
		type: "string",
		persist: false
	},
	{
		name: "account_info",
		type: "string",
		convert: function(v){
			v=Ext.String.htmlEncode(v);
			return v.replace(/\n/g, '<br/>');
		},
		persist: false
	}]
});