Ext.define('app.model.Letter.LetterModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'int'},
	{name: 'period'		, type: 'int', persists: false},
	{name: 'cterm'	, type: 'int', persists: false},
	{name: 'issue', type: 'int'},
	{name: 'info', type: 'string'}
]
});
