Ext.define('app.model.renewUser.RenewUsersGroups', {
	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'id',                           type: 'int'},
		{name: 'renew_user_group_id',          type: 'int', useNull: true},
		{name: 'renew_user_id',                type: 'int', useNull: true}
	],

	proxy: {
		type: 'rest',
		url : '/renew_users/renew_users_groups',
		
		reader: {
			type: 'json',
			messageProperty: 'msg'
		},
		writer: {
			type: 'json'
		},
	}
});