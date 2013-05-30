Ext.define('app.store.Placeunload.AddBuyer.Partners', {
	extend: 'Ext.data.Store',
	model: 'app.model.Placeunload.AddBuyer.PartnerModel',
	proxy: {
		type: 'rest',
		url : '/placeunload/add_buyer/get_partners',
		reader: {
			type: 'json'
		}
	}
});