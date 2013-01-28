Ext.define('app.model.TermDelivery.MakeAutoSetup.PpsZoneWorkdayModel', {
	extend: 'Ext.data.Model',
	fields: [
	{
		name: 'id',
		type: 'date',
		dateFormat: 'Y-m-d',
		convert: function(v, record){
			if(Ext.isDate(v)){
				return v
			} else {
				var val=Ext.Date.parse(v, 'Y-m-d');
				val = (val==null || val==undefined) ? Ext.Date.parse(v, "Y-m-d\\TH:i:s") : val;
				val = (val==null || val==undefined) ? Ext.Date.parse(v, "Y-m-d H:i:s") : val;
				return val;
			}
		}
	},
	{
		name: 'ddate',
		type: 'date',
		dateFormat: 'Y-m-d',
		convert: function(v, record){
			if(Ext.isDate(v)){
				return v
			} else {
				var val=Ext.Date.parse(v, 'Y-m-d');
				val = (val==null || val==undefined) ? Ext.Date.parse(v, "Y-m-d\\TH:i:s") : val;
				val = (val==null || val==undefined) ? Ext.Date.parse(v, "Y-m-d H:i:s") : val;
				return val;
			}
		}
	},
	{name: 'type'		, type:'int', allowNulls: true}
	]
});
