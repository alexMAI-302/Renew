Ext.define('sellPrice.model.sellPriceModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'						, type: 'int'},
	{name: 'goods_id'				, type: 'auto'},
	{name: 'goods_name'				, type: 'string',	persist: false},
	{name: 'lggroup_id'				, type: 'auto',		persist: false},
	{name: 'price'					, type: 'float',	persist: false},
	{name: 'partner_id'				, type: 'int'},
    {name: 'ddateb'					, type: 'date'},
    {name: 'ddatee'					, type: 'date'},
    {name: 'discount'				, type: 'float'},
    {name: 'bprice'					, type: 'float',	persist: false},
    {name: 'sell_reason_id'			, type: 'auto'}]
});
