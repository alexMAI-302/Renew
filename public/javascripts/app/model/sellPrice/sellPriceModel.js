Ext.define('app.model.sellPrice.sellPriceModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'						, type: 'int'},
	{name: 'goods_id'				, type: 'auto'},
	{name: 'goods_name'				, type: 'string',	persist: false},
	{name: 'lggroup_id'				, type: 'auto',		persist: false},
	{name: 'price'					, type: 'float',	persist: false},
	{name: 'partner_id'				, type: 'string'},
    {name: 'ddateb'					, type: 'date',		dateFormat: 'Y-m-d'},
    {name: 'ddatee'					, type: 'date',		dateFormat: 'Y-m-d'},
    {name: 'discount'				, type: 'int'},
    {name: 'bprice'					, type: 'float'},
    {name: 'sell_reason_id'			, type: 'auto'}]
});
