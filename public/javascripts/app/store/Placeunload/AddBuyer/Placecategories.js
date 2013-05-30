Ext.define('app.store.Placeunload.AddBuyer.Placecategories', {
	extend: 'Ext.data.Store',
	model: 'app.model.valueModel',
	proxy: {
		type: 'rest',
		url : '/placeunload/add_buyer/get_placecategories',
		reader: {
			type: 'json'
		}
	}
});