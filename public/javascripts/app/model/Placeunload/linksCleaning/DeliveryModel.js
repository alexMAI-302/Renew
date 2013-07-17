Ext.define('app.model.Placeunload.linksCleaning.DeliveryModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'string'},
	{name: 'ndoc'			, type: 'string'},
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
		}},
	{name: 'securer_name'	, type: 'string'},
	{name: 'ord'			, type: 'int'},
	{name: 'buyer_name'		, type: 'string'}] 
});
