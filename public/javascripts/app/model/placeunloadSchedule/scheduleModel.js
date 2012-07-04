Ext.define('app.model.placeunloadSchedule.scheduleModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'int'},
	{name: 'name'		, type:'string'},
	{name: 'monday'		, type:'boolean'},
	{name: 'tuesday'	, type:'boolean'},
	{name: 'wednesday'	, type:'boolean'},
	{name: 'thursday'	, type:'boolean'},
	{name: 'friday'		, type:'boolean'},
	{name: 'site_id'	, type:'int'}
	]
});
