Ext.define('app.model.TermDelivery.MakeAutoCommonSetup.TerminalModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'int'},
	{name: 'name'		, type:'string', persist: false},
	{name: 'code'		, type:'string', persist: false},
	{name: 'address'	, type:'string', persist: false},
	{name: 'monday'		, type:'boolean'},
	{name: 'tuesday'	, type:'boolean'},
	{name: 'wednesday'	, type:'boolean'},
	{name: 'thursday'	, type:'boolean'},
	{name: 'friday'		, type:'boolean'},
	{name: 'saturday'	, type:'boolean'},
	{name: 'sunday'		, type:'boolean'},
	{name: 'exclude'		, type:'boolean'}
	]
});
