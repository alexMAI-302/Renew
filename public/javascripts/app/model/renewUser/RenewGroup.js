Ext.define('app.model.renewUser.RenewGroup', {
	extend: 'Ext.data.Model',
	
	fields: [
		{name: 'id',   type: 'int'},
		{name: 'name', type: 'string'}
	],
	
	proxy: {
		type: 'rest',
		url : '/renew_users/renew_group',
		
		reader: {
			type: 'json',
			messageProperty: 'msg'
		},
		writer: {
			type: 'json'
		},
	}
});