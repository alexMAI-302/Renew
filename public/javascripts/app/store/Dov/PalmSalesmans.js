Ext.define('app.store.Dov.PalmSalesmans', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'ajax',
		url : '/dov/get_palm_salesmans',
		reader: {
			type: 'json'
		}
	}
});