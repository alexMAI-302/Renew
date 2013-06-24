Ext.define('app.model.empSchedule.empScheduleModel', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id'				, type: 'int'},
		{name: 'dept_name'		, type: 'string'},
		{name: 'person_id'		, type: 'int', useNull: true},
		{name: 'ddateb',
			type:'date',
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'Y-m-d');
					val = (val==null || val==undefined) ? Ext.Date.parse(v, "Y-m-d") : val;
					val = (val==null || val==undefined) ? Ext.Date.parse(v, "d.m.Y") : val;
					return val;
				}
			}
		}, 
		

		{name: 'ddatee'	, type: 'date',		dateFormat: 'd.m.Y',
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'Y-m-d');
					val = (val==null || val==undefined) ? Ext.Date.parse(v, "Y-m-d") : val;
					val = (val==null || val==undefined) ? Ext.Date.parse(v, "d.m.Y") : val;
					return val;
				}
			}
		}, 
		{name: 'schedule_type_id'		, type: 'int'},
		{name: 'priority'		, type: 'int'},
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
		},
		{name: 'min_worktime'		, type: 'int'},
		{name: 'manager'		, type: 'int'},
		{name: 'reason'		, type: 'int'}
	]
});
