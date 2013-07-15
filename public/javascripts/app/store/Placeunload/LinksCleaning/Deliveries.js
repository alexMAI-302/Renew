Ext.define('app.store.Placeunload.LinksCleaning.Deliveries', {
	extend: 'Ext.data.Store',
	model: 'app.model.Placeunload.linksCleaning.DeliveryModel',
	proxy: {
		type: 'rest',
		url : '/placeunload/links_cleaning/get_deliveries',
		reader: {
			type: 'json'
		}
	}
});