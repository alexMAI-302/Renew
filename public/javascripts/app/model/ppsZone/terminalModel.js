Ext.define('app.model.ppsZone.terminalModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'					, type:'int'},
	{name: 'name'				, type:'string'},
	{name: 'bound_notes'		, type:'auto'},
	{name: 'avg_notes'			, type:'float'},
	{name: 'stdev_notes'		, type:'float'},
	{name: 'bound_summ'			, type:'auto'},
	{name: 'opt_bound'			, type:'float'},
	{name: 'avg_summ'			, type:'float'},
	{name: 'stdev_summ'			, type:'float'},
	{name: 'opt_bound_summ'		, type:'float'},
	{name: 'zone_names'			, type:'string', persist: false},
	{name: 'src_system_name'	, type:'string', persist: false},
	{name: 'latitude'			, type:'float'},
	{name: 'longitude'			, type:'float'},
	{name: 'has_zone_bind'		, type:'bool'},
	{name: 'has_geo_zone_bind'	, type:'bool'},
	{name: 'required'			, type:'bool'},
	]
});
