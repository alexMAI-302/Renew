Ext.define('app.store.DelordDelMisc.DelordDelMisc', {
	extend: 'Ext.data.Store',
	model: 'app.model.DelordDelMisc.UserModel',
	proxy: {
		type: 'rest',
		url : '/delord_del_misc/delord_del_misc',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});