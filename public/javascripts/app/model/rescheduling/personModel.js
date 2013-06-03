Ext.define('app.model.rescheduling.personModel', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id'			, type: 'int'},
		{name: 'name'		, type: 'string'},
		{name: 'schedule_type_id', type: 'int'},
		{
			name: 'time_start',
			type: 'time',
			useNull: false,
			dateFormat: 'H:i',
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					return val;
				}
			}
		},
		{
			name: 'time_end',
			type: 'time',
			dateFormat: 'H:i',
			useNull: false,
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					return val;
				}
			}
		}
	]
});
