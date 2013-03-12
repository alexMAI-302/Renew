Ext.define('app.model.incomeReturn.incomeModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'		, type: 'int'},
	{name: 'name'	, type: 'string'},
	{name: 'ddate'	, type: 'date',		dateFormat: 'd.m.Y'},
	]
});
