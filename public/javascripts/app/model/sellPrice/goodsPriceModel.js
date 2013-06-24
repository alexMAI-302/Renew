Ext.define('app.model.sellPrice.goodsPriceModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'goods_id'			, type: 'int'},
	{name: 'goods_name'			, type: 'string'},
	{name: 'lggroup_id'			, type: 'int'},
	{name: 'catmanager_name'	, type: 'string'},
	{name: 'price'				, type: 'float'},
	{name: 'ddateb'				, type: 'date',		dateFormat: 'Y-m-d'},
    {name: 'ddatee'				, type: 'date',		dateFormat: 'Y-m-d'}]
});
