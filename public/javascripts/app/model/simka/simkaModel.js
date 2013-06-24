Ext.define('app.model.simka.simkaModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type: 'int'},
	{name: 'msidn'			, type: 'string'},
	{name: 'icc'			, type: 'string'},
	{name: 'ddate'			, type: 'date',	dateFormat: 'Y-m-d'},
	{name: 'unlim'			, type: 'string'},
	{name: 'date_unlim'		, type: 'date',	dateFormat: 'Y-m-d'},
	{name: 'isblocked'		, type: 'boolean'}
	]
});

