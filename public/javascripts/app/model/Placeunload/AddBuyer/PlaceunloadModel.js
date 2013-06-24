Ext.define('app.model.Placeunload.AddBuyer.PlaceunloadModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'int'},
	{name: 'name'			, type: 'string'},
	{name: 'descr'			, type: 'string'},
	{name: 'address'		, type: 'string'},
	{name: 'fulladdress'	, type: 'string'},
	{name: 'tp'				, type: 'string'},
	{name: 'latitude'		, type: 'float'},
	{name: 'longitude'		, type: 'float'}]
});
