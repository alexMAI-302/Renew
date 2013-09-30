Ext.define('app.model.Geotrack.PlaceunloadModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'int'},
	{name: 'latitude'		, type: 'float',	useNull: true, persists: false},
	{name: 'longitude'		, type: 'float',	useNull: true, persists: false},
	{name: 'name'			, type: 'string',	useNull: true, persists: false},
	{name: 'address'		, type: 'string',	useNull: true, persists: false}]
});
