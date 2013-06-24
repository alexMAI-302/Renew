Ext.define('app.store.Placeunload.AddBuyer.Buyers', {
	extend: 'Ext.data.Store',
	model: 'app.model.Placeunload.AddBuyer.BuyerModel',
	proxy: {
		type: 'rest',
		url : '/placeunload/add_buyer/get_buyers',
		reader: {
			type: 'json'
		}
	}
});