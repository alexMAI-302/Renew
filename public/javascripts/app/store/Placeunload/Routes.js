Ext.define('app.store.Placeunload.Routes', {
	extend: 'Ext.data.Store',
	model: 'app.model.Placeunload.RouteModel',
	proxy: {
		type: 'rest',
		url : '/util_data/get_routes',
		reader: {
			type: 'json'
		}
	}
});