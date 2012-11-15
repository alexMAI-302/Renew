Ext.define('app.model.placeunloadSchedule.scheduleModel', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id'			, type:'int'},
		{name: 'name'		, type:'string'},
		{name: 'address'	, type:'string'},
		{name: 'day_of_week', type:'int', useNull: true},
		{
			name: 'monday',
			type:'boolean',
			convert: function(value, record){
				return record.get("day_of_week")==1;
			}
		},
		{
			name: 'monday',
			type:'boolean',
			convert: function(value, record){
				return record.get("day_of_week")==1;
			}
		},
		{
			name: 'tuesday',
			type:'boolean',
			convert: function(value, record){
				return record.get("day_of_week")==2;
			}
		},
		{
			name: 'wednesday',
			type:'boolean',
			convert: function(value, record){
				return record.get("day_of_week")==3;
			}
		},
		{
			name: 'thursday',
			type:'boolean',
			convert: function(value, record){
				return record.get("day_of_week")==4;
			}
		},
		{
			name: 'friday',
			type:'boolean',
			convert: function(value, record){
				return record.get("day_of_week")==5;
			}
		},
		{name: 'site_id'	, type:'int'}
	]
});
