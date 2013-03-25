Ext.define('app.store.Geotrack.RoutePoints', {
	extend: 'Ext.data.Store',
	model: 'app.model.Geotrack.PointModel',
	proxy: {
		type: 'rest',
		url : '/geotrack/route_points',
		reader: {
			type: 'json'
		}
	}
});