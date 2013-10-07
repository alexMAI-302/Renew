Ext.define('app.model.goodsCatalog.GoodsModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'					, type:'int'},
	{name: 'name'				, type:'string'},
	{name: 'union_goods_names'	, type:'string', persist: false}]
});