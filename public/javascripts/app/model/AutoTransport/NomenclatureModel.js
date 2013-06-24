Ext.define('app.model.AutoTransport.NomenclatureModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'int'},
	{name: 'name'		, type:'string'},
	{name: 'at_ggroup'	, type:'int', useNull: true},
	{name: 'measure'	, type:'int', useNull: true},
	{name: 'cnt'		, type:'int'}]
});
