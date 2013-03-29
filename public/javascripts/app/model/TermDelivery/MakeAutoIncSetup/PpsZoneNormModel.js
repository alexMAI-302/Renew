Ext.define('app.model.TermDelivery.MakeAutoIncSetup.PpsZoneNormModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'string'},
	{name: 'zone'		, type:'int'},
	{name: 'period'		, type:'int'},
	{name: 'wdvalue'	, type:'int'},
	{name: 'satvalue'	, type:'int'},
	{name: 'sunvalue'	, type:'int'}
	]
});
