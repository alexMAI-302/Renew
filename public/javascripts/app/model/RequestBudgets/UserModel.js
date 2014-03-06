Ext.define('app.model.RequestBudgets.UserModel', {
	extend: 'Ext.data.Model',
	fields: [
	{
		name: "id",
		type: "int"
	},
	{
		name: 'ddate',
		type: 'date',
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
		name: "person",
		type: "int",
		useNull: true
	},
	{
		name: "emp_dept",
		type: "string"
	},
	{
		name: "partner",
		type: "int",
		useNull: true
	},
	{
		name: "channel_NRC",
		type: "int",
		useNull: true
	},
	{
		name: "tmside",
		type: "int",
		useNull: true
	},
	{
		name: "summ",
		type: "float",
		useNull: true
	},
		{
		name: "comm",
		type: "string",
		useNull: true
	},
	{
		name: 'priznak', 
		type: 'boolean'
	},
	{
		name: "tmreport_name",
		type: "string"
	},
	{
		name: "catmanager",
		type: "string"
	}
	

	
	
	
	

	
	]
});