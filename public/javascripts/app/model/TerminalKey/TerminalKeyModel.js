Ext.define('app.model.TerminalKey.TerminalKeyModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'int'},
	{name: 'name'				, type: 'string', useNull : true, defaultValue : undefined},
	{name: 'spv_id'				, type: 'int', useNull : true, defaultValue : undefined},
	{name: 'zoneid'				, type: 'int', useNull : true, defaultValue : undefined}
]
});
