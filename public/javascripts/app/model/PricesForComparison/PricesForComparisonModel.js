Ext.define('app.model.PricesForComparison.PricesForComparisonModel', {
	extend : 'Ext.data.Model',
	fields : [{
		name : "id",
		type : "int"
	}, {
		name : "svip",
		type : "int",
		useNull : true
	}, {
		name : "vip",
		type : "int",
		useNull : true
	}, {
		name : "lstop",
		type : "int",
		useNull : true
	}, {
		name : "linput",
		type : "int",
		useNull : true
	}, {
		name : "ort1",
		type : "int",
		useNull : true
	}, {
		name : "ort2",
		type : "int",
		useNull : true
	}, {
		name : "ort3",
		type : "int",
		useNull : true
	}, {
		name : "ort4",
		type : "int",
		useNull : true
	}, {
		name : "ort5",
		type : "int",
		useNull : true
	}, {
		name : "ort6",
		type : "int",
		useNull : true
	}, {
		name : "comm",
		type : "string"
	}, {
		name : "lggroup",
		type : "int",
		useNull : true
	},
	{
		name: "catmanager_name",
		type: "string"
	}
	]
});
