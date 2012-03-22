Ext.define('ppsZoneUsers.model.zoneUserModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'string', persist: false, defaultValue: "_"},
	{name: 'zone_id'	, type:'int'},
	{name: 'user_id'	, type:'int'},
	{name: 'is_new'		, type:'boolean', persist: false, defaultValue: false}]
});