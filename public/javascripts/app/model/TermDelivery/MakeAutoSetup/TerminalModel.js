Ext.define('app.model.TermDelivery.MakeAutoSetup.TerminalModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'int'},
	{name: 'name'		, type:'string'},
	{name: 'code'		, type:'string'},
	{name: 'address'	, type:'string'},
	{name: 'monday'		, type:'boolean'},
	{name: 'tuesday'	, type:'boolean'},
	{name: 'wednesday'	, type:'boolean'},
	{name: 'thursday'	, type:'boolean'},
	{name: 'friday'		, type:'boolean'},
	{name: 'saturday'	, type:'boolean'},
	{name: 'sunday'		, type:'boolean'}
	]
});
