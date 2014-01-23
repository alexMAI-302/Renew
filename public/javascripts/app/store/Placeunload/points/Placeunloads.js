Ext.define('app.store.Placeunload.points.Placeunloads', {
	extend: 'Ext.data.Store',
	model: 'app.model.Placeunload.points.PlaceunloadModel',
	proxy: {
		type: 'rest',
		url : '/placeunload/points/get_placeunloads',
		reader: {
			type: 'json'
		}
	}
});