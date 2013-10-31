Ext.define('app.model.Polygraph.Experienxes', {
	extend: 'Ext.data.Model',
	fields: [
	{
		name: "id",
		type: "int"
	},
	{
		name: "candidate_id",
		type: "int"
	},
	
	{
		name: "organization",
		type: "string"
	},
	{
		name: "position",
		type: "string"
	},
	{
		name: 'ddateb',
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
		name: 'ddatee',
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
	}

	]
});