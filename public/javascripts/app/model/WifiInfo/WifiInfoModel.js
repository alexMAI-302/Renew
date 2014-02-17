Ext.define('app.model.WifiInfo.WifiInfoModel', {
	extend: 'Ext.data.Model',
	fields: [
	{
		name: "id",
		type: "int"
	},
	{
		name: "wifi_name",
		type: "string"
	},
	{
		name: "psk_key",
		type: "string"
	}
	]
});
