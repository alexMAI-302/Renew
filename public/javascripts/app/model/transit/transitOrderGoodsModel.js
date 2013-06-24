Ext.define('app.model.transit.transitOrderGoodsModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'int'},
	{name: 'site_from'	, type:'int'},
	{name: 'site_to'	, type:'int'},
	{name: 'goods_id'	, type:'int'},
	{name: 'goods_name'	, type:'string',	persist: false},
	{name: 'volume'		, type:'auto'},
	{name: 'fact_volume', type:'auto',		persist: false},
	{name: 'vmeas'		, type:'int'},
	{name: 'in_plan'	, type:'boolean',	persist: false},
	{name: 'sddate'		, type:'date',		persist: false, dateFormat: 'c'},
	{name: 'sndoc'		, type:'string',	persist: false}]
});