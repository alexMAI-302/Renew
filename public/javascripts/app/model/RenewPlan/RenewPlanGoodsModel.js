Ext.define('app.model.RenewPlan.RenewPlanGoodsModel', {
	extend: 'Ext.data.Model',
	fields: [
	{
		name: "id",
		type: "int"
	},
	{
		name: "goods",
		type: "int"
	},
	{
		name: "goods_name",
		type: "string"
	},
	{
		name: "remains_to",
		type: "float"
	},
	{
		name: "remains_from",
		type: "float"
	},
	{
		name: "needvol",
		type: "float"
	},
	{
		name: "volume",
		type: "float"
	},
	{
		name: "donevol",
		type: "float"
	},
	{
		name: "measure",
		type: "int"
	},
	{
		name: "goods_volume",
		type: "float"
	},
	{
		name: "sordvol",
		type: "float"
	},
	{
		name: "supvol",
		type: "float"
	},
	{
		name: "trucknum",
		type: "int"
	},
	{
		name: "goodsstat",
		type: "string"
	},
	{
		name: "resvolume",
		type: "float"
	},
	{
		name: "peak",
		type: "int"
	},
	{
		name: "fcast_src",
		type: "int"
	},
	{
		name: "lackvol",
		type: "float"
	},
	{
		name: "isxls",
		type: "int"
	},
	{
		name: "minvol",
		type: "int"
	},
	{
		name: "d",
		type: "int"
	},
	{
		name: "abcd",
		type: "string"
	},
	{
		name: "forecast_volume",
		type: "float"
	}
	]
});
