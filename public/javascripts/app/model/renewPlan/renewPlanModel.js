Ext.define('app.model.renewPlan.renewPlanModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type:'int'},
	{name: 'send_ddate'		, type:'date'},
	{name: 'site_from'		, type:'string'},
	{name: 'site_to'		, type:'string'},
	{name: 'site_to_id'		, type:'int'},
	{name: 'site_from_id'	, type:'int'},
	{name: 'plan'			, type:'boolean'},
	{name: 'sorder'			, type:'boolean'},
	{name: 'sndoc'			, type:'string'},
	{name: 'weight'			, type:'float'},
	{name: 'volume'			, type:'float'},	//назел, ю ме йнкхвеярбн!!!!
	{name: 'sorder_status'	, type:'string'},
	{name: 'site_to_storage', type:'int'}
	]
});
