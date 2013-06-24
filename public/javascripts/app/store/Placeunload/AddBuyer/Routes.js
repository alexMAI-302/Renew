Ext.define('app.store.Placeunload.AddBuyer.Routes', {
	extend: 'Ext.data.Store',
	model: 'app.model.Placeunload.AddBuyer.RouteModel',
	proxy: {
		type: 'rest',
		url : '/placeunload/add_buyer/get_routes',
		reader: {
			type: 'json'
		}
	}
});