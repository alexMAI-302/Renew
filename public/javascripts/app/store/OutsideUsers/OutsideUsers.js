Ext.define('app.store.OutsideUsers.OutsideUsers', {
	extend: 'Ext.data.Store',
	model: 'app.model.OutsideUsers.UserModel',
	proxy: {
		type: 'rest',
		url : '/outside_users/outside_users',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});