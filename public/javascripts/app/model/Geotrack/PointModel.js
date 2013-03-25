Ext.define('app.model.Geotrack.PointModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type: 'int'},
	{name: 'latitude'	, type: 'float',	useNull: true},
	{name: 'longitude'	, type: 'float',	useNull: true},
	{name: 'ts'			, type: 'date',		useNull: true},
	{name: 'info'		, type: 'string'}]
});
