Ext.define('app.store.OutsideUsers.RenewUsers', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/outside_users/get_renew_users',
		reader: {
			type: 'json'
		}
	}
});