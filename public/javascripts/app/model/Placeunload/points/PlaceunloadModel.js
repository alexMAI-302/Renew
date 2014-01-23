Ext.define('app.model.Placeunload.points.PlaceunloadModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'					, type: 'int'},
	{name: 'pname'				, type: 'string'},
	{name: 'descr'				, type: 'string'},
	{name: 'srcaddress'			, type: 'string'},
	{name: 'fulladdress'		, type: 'string'},
	{name: 'tp'					, type: 'string'},
	{name: 'latitude'			, type: 'float'},
	{name: 'longitude'			, type: 'float'},
	{name: 'placecategory_name'	, type: 'string'},
	{name: 'unloading_name'		, type: 'string'},
	{name: 'delschedule_name'	, type: 'string'},
	{name: 'incschedule_name'	, type: 'string'},
	{name: 'buyers_route_name'	, type: 'string'},
	{name: 'ischeck_name'		, type: 'string'},
	{name: 'placecategory_id'	, type: 'int'},
	{name: 'unloading'			, type: 'int'},
	{name: 'delscheduleid'		, type: 'int'},
	{name: 'incscheduleid'		, type: 'int'},
	{name: 'buyers_route_id'	, type: 'int'},
	{name: 'ischeck'			, type: 'boolean'}]
});
