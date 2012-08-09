Ext.define('app.model.mag.palmSaleItemModel', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id'			, type: 'string'},
		{name: 'goods_id'	, type: 'int'},
		{name: 'barcode'	, type: 'string'},
		{name: 'name'		, type: 'string'},
		{name: 'price'		, type: 'float'},
		{name: 'volume'		, type: 'int'},
		{name: 'cost'		, type: 'float'},
		{name: 'sale_id'	, type: 'int'},
		{name: 'is_good'	, type: 'bool'}
	]
});
