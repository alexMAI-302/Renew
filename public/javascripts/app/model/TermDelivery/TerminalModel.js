Ext.define('app.model.TermDelivery.TerminalModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'							, type:'int'},
	{name: 'name'						, type:'string'},
	{name: 'last_connect_time'			, type:'datetime'},
	{name: 'last_connect_time_style'	, type:'string'},
	{name: 'last_payment_time'			, type:'datetime'},
	{name: 'last_payment_time_style'	, type:'string'},
	{name: 'signal_level'				, type:'string'},
	{name: 'state'						, type:'int'},
	{name: 'signal_level'				, type:'string'},
	{name: 'incass_reason'				, type:'string'},
	{name: 'src_system_name'			, type:'string'},
	{name: 'terminal_break_id'			, type:'string'},
	{name: 'branch_name'				, type:'string'},
	{name: 'subdealer'					, type:'string'},
	{name: 's'							, type:'string'},
	{name: 'error'						, type:'string'},
	{name: 'error_text'					, type:'string'}]
});
