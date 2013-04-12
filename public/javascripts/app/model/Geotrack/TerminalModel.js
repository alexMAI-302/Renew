Ext.define('app.model.Geotrack.TerminalModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'int'},
	{name: 'code'			, type: 'string',	useNull: true, persists: false},
	{name: 'terminalid'		, type: 'int',		useNull: true, persists: false},
	{name: 'latitude'		, type: 'float',	useNull: true, persists: false},
	{name: 'longitude'		, type: 'float',	useNull: true, persists: false}]
});
