Ext.define('app.model.Letter.LetterModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type: 'int'},
	{name: 'period'		, type: 'int', persists: false},
	{name: 'cterm'	, type: 'int', persists: false},
	{name: 'issue', type: 'boolean'},
	{name: 'info', type: 'string'},
	{name: 'cname', type: 'string'},
	{name: 'name', type: 'string'},
	{name: 'status', type: 'boolean'}
]
});
