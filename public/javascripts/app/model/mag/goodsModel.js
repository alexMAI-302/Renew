Ext.define('app.model.mag.goodsModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'int'},
	{name: 'bad_goods_id'	, type: 'int'},
	{name: 'barcode'		, type: 'string'},
	{name: 'good_goods_name', type: 'string'},
	{name: 'bad_goods_name'	, type: 'string'},
	{name: 'good_price'		, type: 'float'},
	{name: 'bad_price'		, type: 'float'},
	{name: 'volume'			, type: 'int'}]
});
