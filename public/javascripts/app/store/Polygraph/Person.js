Ext.define('app.store.Polygraph.Person', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/polygraph/get_allperson',
		reader: {
			type: 'json'
		}
	}
});