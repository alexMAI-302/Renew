Ext.define('app.model.TermDelivery.MakeAutoCommonSetup.TerminalModel', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id'			, type:'int'},
		{name: 'name'		, type:'string', persist: false},
		{name: 'code'		, type:'string', persist: false},
		{name: 'address'	, type:'string', persist: false},
		{name: 'monday'		, type:'boolean'},
		{
			name: 'monday_time_begin',
			type: 'time',
			useNull: false,
			dateFormat: 'H:i',
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					if (val==undefined ) {val=null};
					return val;
				}
			}
		},
		{
			name: 'monday_time_end',
			type: 'time',
			dateFormat: 'H:i',
			useNull: false,
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					if (val==undefined ) {val=null};
					return val;
				}
			}
		},
		{name: 'tuesday'	, type:'boolean'},
		{
			name: 'tuesday_time_begin',
			type: 'time',
			useNull: false,
			dateFormat: 'H:i',
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					if (val==undefined ) {val=null};
					return val;
				}
			}
		},
		{
			name: 'tuesday_time_end',
			type: 'time',
			dateFormat: 'H:i',
			useNull: false,
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					if (val==undefined ) {val=null};
					return val;
				}
			}
		},
		{name: 'wednesday'	, type:'boolean'},
		{
			name: 'wednesday_time_begin',
			type: 'time',
			useNull: false,
			dateFormat: 'H:i',
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					if (val==undefined ) {val=null};
					return val;
				}
			}
		},
		{
			name: 'wednesday_time_end',
			type: 'time',
			dateFormat: 'H:i',
			useNull: false,
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					if (val==undefined ) {val=null};
					return val;
				}
			}
		},
		{name: 'thursday'	, type:'boolean'},
		{
			name: 'thursday_time_begin',
			type: 'time',
			useNull: false,
			dateFormat: 'H:i',
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					if (val==undefined ) {val=null};
					return val;
				}
			}
		},
		{
			name: 'thursday_time_end',
			type: 'time',
			dateFormat: 'H:i',
			useNull: false,
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					if (val==undefined ) {val=null};
					return val;
				}
			}
		},		
		{name: 'friday'		, type:'boolean'},
		{
			name: 'friday_time_begin',
			type: 'time',
			useNull: false,
			dateFormat: 'H:i',
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					if (val==undefined ) {val=null};
					return val;
				}
			}
		},
		{
			name: 'friday_time_end',
			type: 'time',
			dateFormat: 'H:i',
			useNull: false,
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					if (val==undefined ) {val=null};
					return val;
				}
			}
		},
		{name: 'saturday'	, type:'boolean'},
		{
			name: 'saturday_time_begin',
			type: 'time',
			useNull: false,
			dateFormat: 'H:i',
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					if (val==undefined ) {val=null};
					return val;
				}
			}
		},
		{
			name: 'saturday_time_end',
			type: 'time',
			dateFormat: 'H:i',
			useNull: false,
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					if (val==undefined ) {val=null};
					return val;
				}
			}
		},
		{name: 'sunday'		, type:'boolean'},
		{
			name: 'sunday_time_begin',
			type: 'time',
			useNull: false,
			dateFormat: 'H:i',
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					if (val==undefined ) {val=null};
					return val;
				}
			}
		},
		{
			name: 'sunday_time_end',
			type: 'time',
			dateFormat: 'H:i',
			useNull: false,
			convert: function(v, record){
				if(Ext.isDate(v)){
					return v
				} else {
					var val=Ext.Date.parse(v, 'H:i');
					if (val==undefined ) {val=null};
					return val;
				}
			}
		},
		{name: 'exclude'	, type:'boolean'},
		{name: 'info'		, type:'string'}
	]
});
