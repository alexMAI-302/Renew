Ext.define('app.model.TermDelivery.TerminalModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'					, type:'int'},
	{name: 'name'				, type:'string'},
	{name: 'last_signal'		, type:'int'},
	{name: 'last_pay'			, type:'int'},
	{name: 'signal_level'		, type:'string'},
	{name: 'state'				, type:'int'},
	{name: 'signal_level'		, type:'string'},
	{name: 'cause_of_include'	, type:'string'},
	{name: 'system'				, type:'string'},
	{name: 'kind_of_break'		, type:'string'},
	{name: 'branch'				, type:'string'},
	{name: 'subdealer'			, type:'string'},
	{name: 's'					, type:'string'},
	{name: 'error'				, type:'string'},
	{name: 'error_comment'		, type:'string'}]
});
