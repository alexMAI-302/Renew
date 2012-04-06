Ext.define('app.model.renewPlan.siteStorageModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type:'int'},
	{name: 'storage_name'	, type:'string'},
	{name: 'site_to'		, type:'int'},
	{name: 'site_from'		, type:'int'}]
});