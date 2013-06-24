Ext.define('app.model.RenewPlan.SiteStorageModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type:'int'},
	{name: 'name'			, type:'string'},
	{name: 'site_to'		, type:'int'},
	{name: 'site_from'		, type:'int'},
	{name: 'selected'		, type:'int'}]
});