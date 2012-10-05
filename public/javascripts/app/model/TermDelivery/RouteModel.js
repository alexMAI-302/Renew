Ext.define('app.model.TermDelivery.RouteModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'					, type:'int'},
	{name: 'name'				, type:'string'},
	{name: 'terminals_quantity'	, type:'int'},
	{name: 'terminals_in_route'	, type:'int'},
	{name: 'is'					, type:'boolean'},
	{name: 'selected'			, type:'boolean'}]
});
