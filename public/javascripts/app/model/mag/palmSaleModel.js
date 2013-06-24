Ext.define('app.model.mag.palmSaleModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type: 'int'},
	{
		name: 'ddate',
		type: 'date',
		convert: function(v, record){
			var val=Ext.Date.parse(v, 'Y-m-d H:i:s');
			val = (val==null || val==undefined) ? Ext.Date.parse(v, "Y-m-d\\TH:i:s") : val;
			return val;
		}
	},
	{name: 'sumtotal'	, type: 'float'},
	{name: 'is_sync'	, type: 'bool'},
	{name: 'closed'		, type: 'bool'}]
});
