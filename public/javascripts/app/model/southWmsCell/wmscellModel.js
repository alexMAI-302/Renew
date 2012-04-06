Ext.define('app.model.southWmsCell.wmscellModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'		, type:'int'},
	{name: 'row'	, type:'string'},
	{name: 'cell'	, type:'int'},
	{name: 'tier'	, type:'int'},
	{name: 'extra'	, type:'string'},
	{name: 'type'	, type:'int'}]
});
