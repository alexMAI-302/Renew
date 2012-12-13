Ext.define('app.model.renewPlan.renewPlanModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type:'int'},
	{
		name: 'send_ddate',
		type:'date',
		dateFormat: 'Y-m-d H:i:s',
		convert: function(v, record){
			var val=Ext.Date.parse(v, 'Y-m-d H:i:s');
			val = (val==null || val==undefined) ? Ext.Date.parse(v, "Y-m-d\\TH:i:s") : val;
			return val;
		}
	},
	{name: 'site_from'		, type:'string'},
	{name: 'site_to'		, type:'string'},
	{name: 'site_to_id'		, type:'int'},
	{name: 'site_from_id'	, type:'int'},
	{name: 'plan'			, type:'boolean'},
	{name: 'sorder'			, type:'boolean'},
	{name: 'sndoc'			, type:'string'},
	{name: 'weight'			, type:'float'},
	{name: 'volume'			, type:'float'},	//�����, � �� ����������!!!!
	{name: 'sorder_status'	, type:'string'},
	{name: 'site_to_storage', type:'int'}
	]
});
