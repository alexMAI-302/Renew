Ext.define('app.store.Geotrack.Placeunloads', {
	extend: 'Ext.data.Store',
	model: 'app.model.Geotrack.PlaceunloadModel',
	proxy: {
		type: 'rest',
		url : '/geotrack/get_placeunloads',
		reader: {
			type: 'json'
		}
	}
});