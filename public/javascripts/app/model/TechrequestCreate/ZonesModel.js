Ext.define('app.model.TechrequestCreate.ZonesModel', {
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
			name: "zone_type",
			type: "int",
			persist: false
		}
	]
});