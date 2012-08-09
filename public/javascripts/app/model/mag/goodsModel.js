Ext.define('app.model.mag.goodsModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type: 'string'},
	{name: 'goods_id'	, type: 'int'},
	{name: 'is_good'	, type: 'bool'},
	{name: 'barcode'	, type: 'string'},
	{name: 'name'		, type: 'string'},
	{name: 'price'		, type: 'float'},
	{name: 'volume'		, type: 'int'}]
});
