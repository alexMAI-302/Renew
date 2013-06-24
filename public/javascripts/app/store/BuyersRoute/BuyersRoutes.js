Ext.define('app.store.BuyersRoute.BuyersRoutes', {
	extend: 'Ext.data.Store',
	model: 'app.model.BuyersRoute.BuyersRouteModel',
	proxy: {
		type: 'rest',
		url : '/buyers_route/buyers_routes',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		}
	}
});