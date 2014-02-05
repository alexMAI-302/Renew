Ext.define('app.model.TechrequestCreate.TechrequestCreateEntryModel', {
	extend: 'Ext.data.Model',
	fields: [
		{
			name: "id",
			type: "int",
			persist: false
		},
		{
			name: "name",
			type: "string",
			persist: false
		},
		{
			name: "code",
			type: "string",
			persist: false
		},
		{
			name: "zones",
			type: "string",
			persist: false
		}
	]
});