Ext.define('app.model.transit.transitOrderModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'int'},
	{name: 'ddate'		, type:'date', persist: false},
	{name: 'agent_id'	, type:'int'},
	{name: 'agent_name'	, type:'string', persist: false},
	{name: 'status1'	, type:'boolean'},
	{name: 'comments'	, type:'string'}]
});