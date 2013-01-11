Ext.define('app.model.TermDelivery.MakeAutoSetup.PpsZoneNormModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'string'},
	{name: 'zone_id'	, type:'int'},
	{name: 'period_id'	, type:'int'},
	{name: 'wdvalue'	, type:'int'},
	{name: 'satvalue'	, type:'int'},
	{name: 'sunvalue'	, type:'int'}
	]
});
