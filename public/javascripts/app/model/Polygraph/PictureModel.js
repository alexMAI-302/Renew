Ext.define('app.model.Polygraph.PictureModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type:'int'},
	{name: 'small_width'	, type:'int'},
	{name: 'small_height'	, type:'int'},
	{name: 'name'			, type:'string'}]
});