Ext.define('app.model.WmsQueue.WmsQueueEntryModel', {
	extend: 'Ext.data.Model',
	fields: [
		{
			name: "id",
			type: "int"
		},
		{
			name: "status",
			type: "int",
			defaultValue: 0
		},
		{
			name: "trans_id",
			type: "int"
		},
		{
			name: "result",
			type: "int"
		},
		{
			name: "request",
			type: "string",
			persist: false
		},
		{
			name: "reply",
			type: "string",
			persist: false
		},
		{
			name: "username",
			type: "string",
			persist: false
		},
		{
			name: "conn",
			type: "int",
			persist: false
		},
		{
			name: "ip",
			type: "string",
			persist: false
		},
		{
			name: "ts",
			type: "string",
			persist: false
		},
		{
			name: "cts",
			type: "string",
			persist: false
		},
		{
			name: "xid",
			type: "string",
			persist: false
		}
	]
});