Ext.define('app.store.Placeunload.AddBuyer.Sites', {
	extend: 'Ext.data.Store',
	model: 'app.model.Placeunload.AddBuyer.SiteModel',
	proxy: {
		type: 'rest',
		url : '/placeunload/add_buyer/get_sites',
		reader: {
			type: 'json'
		}
	}
});