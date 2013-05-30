Ext.define('app.store.Placeunload.AddBuyer.Placeunloads', {
	extend: 'Ext.data.Store',
	model: 'app.model.Placeunload.AddBuyer.PlaceunloadModel',
	proxy: {
		type: 'rest',
		url : '/placeunload/add_buyer/get_placeunloads',
		reader: {
			type: 'json'
		}
	}
});