Ext.define('app.model.TermDelivery.MonitorTabs.TechRequest.TechRequestModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'							, type:'int'},
	{name: 'terminal_name'				, type:'string'},
	{name: 'techrequest_type_name'		, type:'string'},
	{name: 'status'						, type:'boolean'},
	{name: 'comments'					, type:'string'}]
});