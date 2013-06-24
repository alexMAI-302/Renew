Ext.define('app.store.outsideUsers.OutsideUsers', {
	extend: 'Ext.data.Store',
	model: 'app.model.outsideUsers.UserModel',
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