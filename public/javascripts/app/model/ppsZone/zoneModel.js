Ext.define('app.model.ppsZone.zoneModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'int'},
	{name: 'name'		, type:'string'},
	{name: 'visit_freq'	, type:'int'},
	{name: 'status'		, type:'int'},
	{name: 'bound_notes', type:'int'},
	{name: 'bound_summ'	, type:'float'},
	{name: 'subdealerid', type:'int'},
	{name: 'branch'		, type:'int'},
	{name: 'points'		, type:'string', persist: false},
	{name: 'spv_id'		, type:'int'},
	{name: 'overtime_payment'		, type:'bool'}]
});