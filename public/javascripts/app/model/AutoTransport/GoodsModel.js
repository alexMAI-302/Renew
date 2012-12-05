Ext.define('app.model.AutoTransport.GoodsModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'int'},
	{name: 'master_id'	, type:'int'},
	{name: 'at_ggroup'	, type:'int'},
	{name: 'at_goods'	, type:'int'},
	{name: 'measure'	, type:'int'},
	{name: 'vol'		, type:'int'},
	{name: 'price'		, type:'float'},
	{
		name: 'sum',
		type:'float',
		convert: function(value, record){
			return record.get('vol')*record.get('price');
		},
		persist: false
	}]
});
