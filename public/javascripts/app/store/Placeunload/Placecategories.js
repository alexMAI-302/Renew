Ext.define('app.store.Placeunload.Placecategories', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/util_data/get_placecategories',
		reader: {
			type: 'json'
		}
	}
});