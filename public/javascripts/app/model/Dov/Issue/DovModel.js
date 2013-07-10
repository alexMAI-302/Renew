Ext.define('app.model.Dov.Issue.DovModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'			, type:'int'},
	{name: 'ndoc'		, type:'string'},
	{name: 'to_print'	, type:'boolean', persist: false}]
});
