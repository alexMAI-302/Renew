Ext.define('app.store.BuyersRoute.Placeunloads', {
	extend: 'Ext.data.Store',
	model: 'app.model.BuyersRoute.PlaceunloadModel',
	proxy: {
		type: 'rest',
		url : '/buyers_route/get_placeunload',
		reader: {
			type: 'json'
		}
	}
});