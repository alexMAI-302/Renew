Ext.define('app.model.AutoTransport.GoodsModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'int', useNull: true},
	{name: 'master_id'	, type:'int', useNull: true},
	{name: 'at_ggroup'	, type:'int', useNull: true},
	{name: 'at_goods'	, type:'int', useNull: true},
	{name: 'measure'	, type:'int', useNull: true},
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
