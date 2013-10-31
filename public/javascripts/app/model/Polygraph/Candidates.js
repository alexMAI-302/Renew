Ext.define('app.model.Polygraph.Candidates', {
	extend: 'Ext.data.Model',
	fields: [
	{
		name: "id",
		type: "int"
	},
	
	{
		name: 'ddate',
		type:'date',
		convert: function(v, record){
			if(Ext.isDate(v)){
				return v
			} else {
				var val=Ext.Date.parse(v, 'Y-m-d H:i:s');
				val = (val==null || val==undefined) ? Ext.Date.parse(v, "Y-m-d\\TH:i:s") : val;
				val = (val==null || val==undefined) ? Ext.Date.parse(v, "d.m.Y H:i") : val;
				return val;
			}
	}
	},
	{
		name: "lname",
		type: "string"
	},
	{
		name: "fname",
		type: "string"
	},
	{
		name: "mname",
		type: "string"
	},
	{
		name: "emp_pos_id",
		type: "int",
		useNull: true
	},
	
	{
		name: 'birth_date',
		type:'date',
		convert: function(v, record){
			if(Ext.isDate(v)){
				return v
			} else {
				var val=Ext.Date.parse(v, 'Y-m-d H:i:s');
				val = (val==null || val==undefined) ? Ext.Date.parse(v, "Y-m-d\\TH:i:s") : val;
				val = (val==null || val==undefined) ? Ext.Date.parse(v, "d.m.Y H:i") : val;
				return val;
			}
	}
	},
	{
		name: "zodiac_id",
		type: "int",
		useNull: true
	},
	{
		name: "marital_status",
		type: "int",
		useNull: true
	},
	{
		name: "children_count",
		type: "int"
	},
	{
		name: "result_id",
		type: "int",
		useNull: true
	}

	
	]
});