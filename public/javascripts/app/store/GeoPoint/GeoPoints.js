Ext.define('app.store.GeoPoint.GeoPoints', {
	extend: 'Ext.data.Store',
	model: 'app.model.GeoPoint.GeoPointModel',
	proxy: {
		type: 'rest',
		url : '/geo_point/geo_points',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});