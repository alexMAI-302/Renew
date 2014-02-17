Ext.define('app.model.TermDelivery.MonitorTabs.MonitorTab.TerminalModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'							, type:'int'},
	{name: 'info_terminal_id'			, type:'int'},
	{name: 'row_class'					, type:'string'},
	{name: 'in_route'					, type:'boolean'},
	{name: 'name'						, type:'string'},
	{
		name: 'last_connect_time',
		type: 'datetime',
		dateFormat: 'Y-m-d H:i:s',
		convert: function(v, record){
			var val=Ext.Date.parse(v, 'Y-m-d H:i:s');
			val = (val==null || val==undefined) ? Ext.Date.parse(v, "Y-m-d\\TH:i:s") : val;
			return val;
		},
		sortType: function(value){
			return value?value:new Date(0, 0, 0);
		},
		useNull: true
	},
	{name: 'last_connect_time_class'	, type:'string'},
	{
		name: 'last_payment_time',
		type: 'datetime',
		dateFormat: 'Y-m-d H:i:s',
		convert: function(v, record){
			var val=Ext.Date.parse(v, 'Y-m-d H:i:s');
			val = (val==null || val==undefined) ? Ext.Date.parse(v, "Y-m-d\\TH:i:s") : val;
			return val;
		},
		sortType: function(value){
			return value?value:new Date(0, 0, 0);
		},
		useNull: true
	},
	{name: 'last_payment_time_class'	, type:'string'},
	{name: 'summ'						, type:'int'},
	{name: 'cnt'						, type:'int'},
	{name: 'signal_level'				, type:'int'},
	{name: 'error_text'					, type:'string'},
	{name: 'incass_reason'				, type:'string'},
	{name: 'src_system_name'			, type:'string'},
	{name: 'subdealer_id'				, type:'int'},
	{name: 'subdealer_name'				, type:'string'},
	{name: 'terminal_break_id'			, type:'int',		useNull: true},
	{name: 'branch_name'				, type:'string'},
	{name: 'serv_status'				, type:'boolean'},
	{name: 'penalty_status'				, type:'boolean'},
	{name: 'techinfo'					, type:'string'},
	{name: 'should_include_in_route'	, type:'boolean'},
	{name: 'must_visit'					, type:'boolean'}]
});