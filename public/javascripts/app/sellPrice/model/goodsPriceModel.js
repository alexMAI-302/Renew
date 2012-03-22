Ext.define('sellPrice.model.goodsPriceModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'goods_id'	, type:'int'},
	{name: 'goods_name'	, type:'string'},
	{name: 'lggroup_id'	, type:'int'},
	{name: 'price'		, type:'float'}]
});
