Ext.define('app.model.renewUser.RenewGroupsUrls', {
	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'id',                           type: 'int'},
		{name: 'renew_user_group_id',          type: 'int'},
		{name: 'renew_user_url_id',            type: 'int', useNull: true}
	],

	proxy: {
		type: 'rest',
		url : '/renew_users/renew_groups_urls',
		
		reader: {
			type: 'json',
			messageProperty: 'msg'
		},
		writer: {
			type: 'json'
		},
	}
});