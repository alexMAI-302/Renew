Ext.define('app.store.Placeunload.AddBuyer.PartnersGroups', {
	extend: 'Ext.data.Store',
	model: 'app.model.Placeunload.AddBuyer.PartnersGroupModel',
	proxy: {
		type: 'rest',
		url : '/placeunload/add_buyer/get_partners_groups',
		reader: {
			type: 'json'
		}
	}
});