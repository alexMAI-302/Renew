Ext.define('app.model.placeunloadSchedule.ScheduleModel', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id'			, type:'int'},
		{
			name: 'name',
			type:'string', 
			persist: false
		},
		{
			name: 'address',
			type:'string',
			persist: false
		},
		{
			name: 'day_of_week',
			type:'int'
		},
		{
			name: 'monday',
			type:'boolean',
			persist: false,
			convert: function(value, record){
				return record.get("day_of_week") & 1;
			}
		},
		{
			name: 'tuesday',
			type:'boolean',
			persist: false,
			convert: function(value, record){
				return record.get("day_of_week") & 2;
			}
		},
		{
			name: 'wednesday',
			type:'boolean',
			persist: false,
			convert: function(value, record){
				return record.get("day_of_week") & 4;
			}
		},
		{
			name: 'thursday',
			type:'boolean',
			persist: false,
			convert: function(value, record){
				return record.get("day_of_week") & 8;
			}
		},
		{
			name: 'friday',
			type:'boolean',
			persist: false,
			convert: function(value, record){
				return record.get("day_of_week") & 16;
			}
		},
		{
			name: 'podr',
			type:'string',
			persist: false
		},
		{
			name: 'podr_tooltip',
			type:'string',
			persist: false
		},
	]
});
