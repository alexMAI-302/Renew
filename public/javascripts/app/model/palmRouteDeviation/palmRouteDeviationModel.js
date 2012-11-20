Ext.define('app.model.palmRouteDeviation.palmRouteDeviationModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'int'},
	{name: 'salesman'		, type: 'string'},
	{name: 'buyer'			, type: 'string'},
	{name: 'loadto'			, type: 'string'},
	{name: 'type'			, type: 'string'},
	{name: 'reason'			, type: 'int'},
	{name: 'comments'			, type: 'string'}
	]
});
