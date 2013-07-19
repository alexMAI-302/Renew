Ext.define('app.model.RenewPlan.RenewPlanGoodsModel', {
	extend: 'Ext.data.Model',
	fields: [
	{
		name: "id",
		type: "int",
		useNull: true
	},
	{
		name: "goods",
		type: "int",
		useNull: true
	},
	{
		name: "goods_name",
		type: "string",
		useNull: true,
		persist: false
	},
	{
		name: "remains_to",
		type: "float",
		useNull: true,
		persist: false
	},
	{
		name: "remains_from",
		type: "float",
		useNull: true,
		persist: false
	},
	{
		name: "needvol",
		type: "float",
		useNull: true,
		persist: false
	},
	{
		name: "volume",
		type: "int",
		useNull: true,
		persist: false
	},
	{
		name: "donevol",
		type: "int",
		useNull: true
	},
	{
		name: "goods_volume",
		type: "float",
		useNull: true,
		persist: false
	},
	{
		name: "weight",
		type: "float",
		useNull: true,
		persist: false
	},
	{
		name: "sordvol",
		type: "float",
		useNull: true,
		persist: false
	},
	{
		name: "supvol",
		type: "float",
		useNull: true,
		persist: false
	},
	{
		name: "trucknum",
		type: "int",
		useNull: true
	},
	{
		name: "goodsstat",
		type: "string",
		useNull: true,
		persist: false
	},
	{
		name: "resvolume",
		type: "float",
		useNull: true,
		persist: false
	},
	{
		name: "peak",
		type: "int",
		useNull: true,
		persist: false
	},
	{
		name: "lackvol",
		type: "float",
		useNull: true,
		persist: false
	},
	{
		name: "isxls",
		type: "int",
		useNull: true,
		persist: false
	},
	{
		name: "minvol",
		type: "float",
		useNull: true,
		persist: false
	},
	{
		name: "lminvol",
		type: "int",
		useNull: true,
		persist: false
	},
	{
		name: "d",
		type: "int",
		useNull: true,
		persist: false
	},
	{
		name: "abcd",
		type: "string",
		useNull: true,
		persist: false
	},
	{
		name: "sale_category",
		type: "string",
		useNull: true,
		persist: false
	},
	{
		name: "goods_abc",
		type: "string",
		useNull: true,
		persist: false
	},
	{
		name: "has_remains",
		type: "string",
		useNull: true,
		persist: false
	},
	{
		name: "fcast_src",
		type: "int",
		useNull: true,
		persist: false
	},
	{
		name: "pans",
		type: "float",
		useNull: true,
		persist: false
	},
	{
		name: "row_class",
		type: "string",
		useNull: true,
		persist: false
	},
	{
		name: "volume_class",
		type: "string",
		useNull: true,
		persist: false
	},
	{
		name: "single_volume",
		type: "float",
		useNull: true,
		persist: false
	},
	{
		name: "single_weight",
		type: "float",
		useNull: true,
		persist: false
	},
	{
		name: "lggroup",
		type: "int",
		useNull: true,
		persist: false
	},
	]
});
