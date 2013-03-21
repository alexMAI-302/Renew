Ext.define('app.model.GeoPoint.GeoPointModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type: 'int'},
	{name: 'terminalID'	, type: 'int'	, persists: false},
	{name: 'code'		, type: 'string', persists: false},
	{name: 'name'		, type: 'string', persists: false},
	{name: 'taddress'	, type: 'string'},
	{name: 'srcaddress'	, type: 'string'},
	{name: 'fulladdress', type: 'string'},
	{name: 'latitude'	, type: 'float', useNull: true},
	{name: 'longitude'	, type: 'float', useNull: true},
	{name: 'ismanual'	, type: 'int'},
	{name: 'city'		, type: 'string', persists: false}]
});
