Ext.define('app.model.TermDelivery.RouteModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'					, type:'int'},
	{name: 'name'				, type:'string'},
	{name: 'points'				, type:'int'},
	{name: 'points_inroute'		, type:'int'},
	{name: 'delivery'			, type:'int'},
	{name: 'delivery_status4'	, type:'boolean'},
	{name: 'selected'			, type:'boolean'}]
});
