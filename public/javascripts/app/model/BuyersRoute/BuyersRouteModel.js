Ext.define('app.model.BuyersRoute.BuyersRouteModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type: 'int'},
	{name: 'name'		, type: 'string', persists: false},
	{name: 'points'		, type: 'string'},
	{name: 'points_str'	, type: 'string'}]
});
