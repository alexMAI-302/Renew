Ext.define('app.model.Geotrack.TerminalModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'int'},
	{name: 'code'			, type: 'string',	useNull: true, persists: false},
	{name: 'terminalid'		, type: 'int',		useNull: true, persists: false},
	{name: 'latitude'		, type: 'float',	useNull: true, persists: false},
	{name: 'longitude'		, type: 'float',	useNull: true, persists: false},
	{name: 'cts_ok'			, type: 'date',		useNull: true, persists: false},
	{name: 'ok_distance'	, type: 'float',	useNull: true, persists: false},
	{name: 'ok_latitude'	, type: 'float',	useNull: true, persists: false},
	{name: 'ok_longitude'	, type: 'float',	useNull: true, persists: false}]
});
