Ext.define('app.model.AutoTransport.ReceptModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'		, type:'int'},
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
	{name: 'truck_id'	, type:'int', useNull: true},
	{name: 'truck_name'	, type:'string', useNull: true, persist: false}]
});
