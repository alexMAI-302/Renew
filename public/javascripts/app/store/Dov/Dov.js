Ext.define('app.store.Dov.Dov', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/dov/get_dov',
		reader: {
			type: 'json'
		}
	}
});