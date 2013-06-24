Ext.define('app.model.sellPriceUsers.sellPriceUserModel', {
	extend: 'Ext.data.Model',
	fields: [
	{name: 'id'					, type:'string', persist: false},
	{name: 'partner_group_id'	, type:'string'},
	{name: 'user_id'			, type:'int'},
	{name: 'is_new'				, type:'boolean', persist: false, defaultValue: false}]
});