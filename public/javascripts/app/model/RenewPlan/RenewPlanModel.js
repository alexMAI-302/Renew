Ext.define('app.model.RenewPlan.RenewPlanModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'				, type:'int'},
	{
		name: 'send_ddate',
		type:'date',
		convert: function(v, record){
			if(Ext.isDate(v)){
				return v
			} else {
				var val=Ext.Date.parse(v, 'Y-m-d H:i:s');
				val = (val==null || val==undefined) ? Ext.Date.parse(v, "Y-m-d\\TH:i:s") : val;
				val = (val==null || val==undefined) ? Ext.Date.parse(v, "d.m.Y H:i") : val;
				return val;
			}
		}
	},
	{
		name: 'sup_ddate',
		type:'date',
		convert: function(v, record){
			if(Ext.isDate(v)){
				return v
			} else {
				var val=Ext.Date.parse(v, 'Y-m-d H:i:s');
				val = (val==null || val==undefined) ? Ext.Date.parse(v, "Y-m-d\\TH:i:s") : val;
				val = (val==null || val==undefined) ? Ext.Date.parse(v, "d.m.Y H:i") : val;
				return val;
			}
		}
	},
	{
		name: "truckvol",
		type: "float"
	},
	{
		name: "site_from",
		type: "int"
	},
	{
		name: "site_to",
		type: "int"
	},
	{
		name: "k_renew",
		type: "float"
	},
	{
		name: "k_sens",
		type: "float"
	},
	{
		name: "k_rem",
		type: "float"
	},
	{
		name: "status1",
		type: "int",
		persist: false
	},
	{
		name: "status2",
		type: "int",
		persist: false
	},
	{
		name: "sorder",
		type: "string",
		useNull: true,
		persist: false
	},
	{
		name: "sorder_status1",
		type: "float",
		useNull: true,
		persist: false
	},
	{
		name: "sitevol",
		type: "int",
		useNull: true,
		persist: false
	},
	{
		name: "sordvol",
		type: "float",
		useNull: true,
		persist: false
	},
	{
		name: "sorder_ndoc",
		type: "string",
		persist: false
	},
	{
		name: "ndocs_by_orders",
		type: "string",
		persist: false
	},
	{
		name: "renew_plan_type_id",
		type: "int",
		persist: false
	},
	{
		name: 'site_to_storage',
		type:'int',
		useNull: true,
		persist: false
	},
	{
		name: "weight_by_orders",
		type: "string",
		persist: false
	},
	{
		name: "volume_by_orders",
		type: "string",
		persist: false
	},
	{
		name: "weight",
		type: "float",
		persist: false
	},
	{
		name: "volume",
		type: "float",
		persist: false
	}
	]
});
