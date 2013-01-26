Ext.define('app.store.Dov.Revoke.Dov', {
	extend: 'Ext.data.Store',
	model: 'app.model.Dov.Revoke.DovModel',
	proxy: {
		type: 'ajax',
		url : '/dov/get_dov_revoke',
		reader: {
			type: 'json'
		}
	}
});