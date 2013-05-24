Ext.define('app.model.placeunloadSchedule.ScheduleModel', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id'			, type:'int'},
		{name: 'name'		, type:'string'},
		{name: 'address'	, type:'string'},
		{
			name: 'day_of_week',
			type:'int',
			useNull: true
		},
		{
			name: 'monday',
			type:'boolean',
			persists: false,
			convert: function(value, record){
				return record.get("day_of_week")==1;
			}
		},
		{
			name: 'tuesday',
			type:'boolean',
			persists: false,
			convert: function(value, record){
				return record.get("day_of_week")==2;
			}
		},
		{
			name: 'wednesday',
			type:'boolean',
			persists: false,
			convert: function(value, record){
				return record.get("day_of_week")==3;
			}
		},
		{
			name: 'thursday',
			type:'boolean',
			persists: false,
			convert: function(value, record){
				return record.get("day_of_week")==4;
			}
		},
		{
			name: 'friday',
			type:'boolean',
			persists: false,
			convert: function(value, record){
				return record.get("day_of_week")==5;
			}
		}
	]
});
