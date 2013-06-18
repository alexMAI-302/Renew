Ext.define('app.model.Dov.Revoke.DovModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type:'int'},
	{name: 'salesman_name'	, type:'string'},
	{name: 'ndoc'			, type:'int'},
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
	{name: 'status'		, type:'int'},
	{name: 'unused'		, type:'int'},
	{name: 'renew_user'	, type:'string'},
	{name: 'message'	, type:'string', persits: 'false'}]
});
