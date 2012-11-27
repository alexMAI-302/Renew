Ext.define('app.model.renewUser.RenewUser', {
	extend: 'Ext.data.Model',

	fields: [
		{name: 'id',   type: 'int'},
		{name: 'name', type: 'string'}
	],
	
	proxy: {
		type: 'rest',
		url : '/renew_users/renew_user',
		
		reader: {
			type: 'json',
			messageProperty: 'msg'
		},
		writer: {
			type: 'json'
		},
	}
});